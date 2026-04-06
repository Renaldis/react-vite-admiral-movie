// @ts-nocheck

import fs from "node:fs";
import { resolve, extname, dirname, basename } from "node:path";
import { pipeline } from "node:stream";
import Debug from "debug";
import MagicString from "magic-string";
import { fetch } from "node-fetch-native";
import { hash } from "ohash";

// Helper untuk menormalkan path (mengganti '\' dengan '/')
function slash(str) {
  return str.replace(/\\/g, "/");
}

// Aturan default untuk mencocokkan URL aset dalam kode
const DefaultRules = [
  {
    // Regex diperbarui untuk mendukung URL dengan query parameters.
    match: /\b(https?:\/\/[\w./-]*\.(?:png|jpe?g|svg|ico)[^\s`'")]*)/gi,
  },
];

// Memvalidasi apakah string adalah URL HTTP/HTTPS yang valid
function isValidHttpUrl(str) {
  let url;

  try {
    url = new URL(str);
  } catch {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

// Helper untuk menunda eksekusi (digunakan untuk 'retry-after')
function sleep(seconds) {
  return new Promise((resolve2) => setTimeout(resolve2, seconds * 1e3));
}

const debug = Debug("vite-plugin-remote-assets");

function VitePluginRemoteAssets(options = {}) {
  const {
    /**
     * PERUBAHAN UTAMA: Lokasi cache dipindahkan ke 'public/cache'.
     * Vite akan secara otomatis menyalin konten dari sini ke 'dist/cache'.
     */

    cacheDir = "public/cache",
    rules = DefaultRules,
    awaitDownload = true,
    retryTooManyRequests = false,
  } = options;

  let dir; // Path absolut ke direktori cache
  let config; // Konfigurasi Vite yang telah di-resolve
  const envs = [];

  // Fungsi untuk mengunduh URL ke file lokal
  async function downloadTo(url, filepath, { retryTooManyRequests: retryTooManyRequests2 }) {
    await fs.promises.mkdir(dirname(filepath), { recursive: true });
    const writer = fs.createWriteStream(filepath);
    const response = await fetch(url);

    if (response.status === 429) {
      const retryAfter = +(response.headers.get("retry-after") || 0);

      if (!retryAfter) {
        throw new Error(`${url}: 429 without retry-after header`);
      } else {
        debug(`${url}: 429, retry after ${retryAfter} seconds`);
        await sleep(retryAfter);
        return await downloadTo(url, filepath, { retryTooManyRequests: retryTooManyRequests2 });
      }
    }

    return new Promise((resolve2, reject) => {
      pipeline(response.body, writer, (err) => {
        if (err) reject(err);
        else resolve2();
      });
    });
  }

  const tasksMap = {};

  // Fungsi utama untuk mentransformasi kode sumber
  async function transform(code, id) {
    const tasks = [];
    const s = new MagicString(code);
    let hasReplaced = false;
    let match;

    for (const rule of rules) {
      rule.match.lastIndex = 0;

      while ((match = rule.match.exec(code))) {
        const start = match.index;
        const end = start + match[0].length;
        const url = match[0];

        if (!url || !isValidHttpUrl(url)) continue;
        const urlObject = new URL(url);
        const fileExtension = extname(urlObject.pathname);
        const hash$1 = hash(url) + (rule.ext || fileExtension);
        const filepath = slash(resolve(dir, hash$1));
        debug("detected", url, "cache to", filepath);

        if (!fs.existsSync(filepath) || tasksMap[filepath]) {
          if (!tasksMap[filepath]) {
            tasksMap[filepath] = (async () => {
              try {
                debug("downloading", url);
                await downloadTo(url, filepath, { retryTooManyRequests });
                debug("downloaded", url);
              } catch (e) {
                if (fs.existsSync(filepath)) await fs.promises.unlink(filepath);
                throw e;
              } finally {
                delete tasksMap[filepath];
              }
            })();
          }

          tasks.push(tasksMap[filepath]);

          if (!awaitDownload) continue;
        }

        hasReplaced = true;

        // PERUBAHAN UTAMA: Logika pembuatan URL
        // Karena file ada di 'public/cache', URL publiknya akan menjadi '/cache/namafile'.
        // Ini berlaku untuk mode 'serve' dan 'build'.
        const publicPath = basename(cacheDir);
        const newUrl = `/${publicPath}/${hash$1}`;
        s.overwrite(start, end, newUrl);
      }
    }

    if (tasks.length) {
      if (awaitDownload) {
        await Promise.all(tasks);
      } else {
        Promise.all(tasks).then(() => {
          envs.forEach((env) => {
            const moduleGraph = env.moduleGraph;
            const module = moduleGraph.getModuleById(id);
            if (module) moduleGraph.invalidateModule(module);
          });
        });
      }
    }

    if (!hasReplaced) return null;

    return {
      code: s.toString(),
      map: config.build.sourcemap ? s.generateMap({ hires: true }) : null,
    };
  }

  return {
    name: "vite-plugin-remote-assets",
    enforce: "pre",

    // Hook 'config' tidak lagi diperlukan karena Vite menangani 'public' secara default.
    // Namun, kita biarkan untuk konsistensi jika user ingin mengubah ke direktori non-publik lagi.
    // config(userConfig) {
    //   const cacheDirAbs = resolve(userConfig.root || process.cwd(), cacheDir);

    //   return {
    //     ...userConfig,
    //     server: {
    //       ...(userConfig.server || {}),
    //       fs: {
    //         ...(userConfig.server?.fs || {}),
    //         allow: [...(userConfig.server?.fs?.allow || []), cacheDirAbs],
    //       },
    //     },
    //   };
    // },

    async configResolved(_config) {
      config = _config;
      dir = slash(resolve(config.root, cacheDir));

      if (config.server?.force || config.optimizeDeps?.force) {
        await fs.promises.rm(dir, { recursive: true, force: true });
      }

      await fs.promises.mkdir(dir, { recursive: true });
    },

    configureServer(server) {
      if (
        "environments" in server &&
        typeof server.environments === "object" &&
        server.environments != null
      ) {
        Object.values(server.environments).forEach((env) => envs.push(env));
      } else {
        envs.push(server);
      }
    },

    async transform(code, id) {
      if (id.includes("node_modules")) return;
      return await transform(code, id);
    },

    transformIndexHtml: {
      order: "pre",
      async handler(code, ctx) {
        const result = await transform(code, ctx.filename);
        return result?.code;
      },
    },
  };
}

export { DefaultRules, VitePluginRemoteAssets, VitePluginRemoteAssets as default };
