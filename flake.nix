{
  description = "Maul NIX";

  inputs = {nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";};

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [];
      systems = ["aarch64-darwin" "x86_64-darwin" "x86_64-linux" "aarch64-linux"];
      perSystem = {
        config,
        self',
        inputs',
        pkgs,
        system,
        ...
      }: {
        packages = {
          nodejs16-darwin-arm64 = pkgs.stdenv.mkDerivation {
            name = "nodejs20.12.1-darwin-arm64";
            src = pkgs.fetchurl {
              url = "https://nodejs.org/dist/v20.12.1/node-v20.12.1-darwin-arm64.tar.gz";
              sha256 = "sha256-nqYHZoB808OjrWrUGfmJGNY0pg/o3qW5wHUH7Q8XbUw=";
            };
            installPhase = ''
              echo "installing nodejs"
              mkdir -p $out
              cp -r ./ $out/
            '';
          };

          nodejs16-darwin-x64 = pkgs.stdenv.mkDerivation {
            name = "nodejs20.12.1-darwin-x64";
            src = pkgs.fetchurl {
              url = "https://nodejs.org/dist/v20.12.1/node-v20.12.1-darwin-x64.tar.gz";
              sha256 = "sha256-N+CajPI1LzQNEgTGFUBY2BNi/vTsSIsBl7LONrPwNno=";
            };
            installPhase = ''
              echo "installing nodejs"
              mkdir -p $out
              cp -r ./ $out/
            '';
          };

          nodejs16-linux-x64 = pkgs.stdenv.mkDerivation {
            name = "nodejs20.12.1-linux-x64";
            src = pkgs.fetchurl {
              url = "https://nodejs.org/dist/v20.12.1/node-v20.12.1-linux-x64.tar.gz";
              sha256 = "sha256-2i9ZCjlxd5Lc+MS/a55LJpYB5s46PxUKPEs3n37qbYM=";
            };
            installPhase = ''
              echo "installing nodejs"
              mkdir -p $out
              cp -r ./ $out/
            '';
          };

          nodejs16-linux-arm64 = pkgs.stdenv.mkDerivation {
            name = "nodejs20.12.1-linux-arm64";
            src = pkgs.fetchurl {
              url = "https://nodejs.org/dist/v20.12.1/node-v20.12.1-linux-arm64.tar.gz";
              sha256 = "sha256-RuOFf1VSq9NtlUg4DXlbBDo87sJQTmn+GnVPp2AS2q8=";
            };
            installPhase = ''
              echo "installing nodejs"
              mkdir -p $out
              cp -r ./ $out/
            '';
          };
        };

        devShells.default = pkgs.mkShell {
          buildInputs = [
            (
              if system == "aarch64-linux"
              then self'.packages.nodejs16-linux-arm64
              else if system == "aarch64-darwin"
              then self'.packages.nodejs16-darwin-arm64
              else if system == "x86_64-linux"
              then self'.packages.nodejs16-linux-x64
              else if system == "x86_64-darwin"
              then self'.packages.nodejs16-darwin-x64
              else null
            )
            pkgs.gnused
            pkgs.docker
            pkgs.nodePackages.node-gyp-build
            pkgs.nodePackages.yarn
            pkgs.nodePackages."dockerfile-language-server-nodejs"
            pkgs.nodePackages."typescript"
            pkgs.nodePackages."typescript-language-server"
            pkgs.nodePackages."vscode-langservers-extracted"
            pkgs.nodePackages."@tailwindcss/language-server"
            pkgs.emmet-ls

            (pkgs.stdenv.mkDerivation {
              name = "pnpm-8.14.1";
              src = pkgs.fetchurl {
                url = "https://registry.npmjs.org/pnpm/-/pnpm-8.14.1.tgz";
                sha256 = "sha256-LfeOZdQz12k7nT+9r0MbLZa7T5ai/+zVGlDv4W5Qpqg=";
              };
              installPhase = ''
                    echo "Installing pnpm"
                    mkdir -p $out/bin
                    mkdir -p $out/lib/pnpm
                    tar -xzf $src
                    cp -r package/dist/* $out/lib/pnpm/

                    # Create a wrapper script for pnpm
                    cat > $out/bin/pnpm <<EOF
                #!/usr/bin/env bash
                node $out/lib/pnpm/pnpm.cjs "\$@"
                EOF

                    chmod +x $out/bin/pnpm
              '';
            })
          ];

          shellHook = ''
            export PATH="$out/bin:$PATH"
            echo "PNPM has been added to your environment."
          '';
        };
      };
      flake = {};
    };
}
