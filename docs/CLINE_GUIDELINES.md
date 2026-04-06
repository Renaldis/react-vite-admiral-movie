# AI Prototyping dengan Cline

## Sebelum Mulai Prompting

Hal-hal yang perlu diperhatikan sebelum mulai menulis prompt:
- Observasi design yang ada di figma. 
- Apabila menemukan perbedaan antara file `examples` dengan figma, maka sesuaikan terlebih dahulu. Tujuannya untuk mengurangi proses berfikir yang dilakukan oleh AI saat generate code.
- Pahami rules-rules yang ada di folder `.clinerules`. Apabila ditemukan rules yang kurang sesuai dengan kebutuhan projek, maka sesuaikan terlebih dahulu.

## Model Rekomendasi

Berikut adalah rekomendasi model yang dapat digunakan berdasarkan tingkat kompleksitas modul yang akan digenerate:

| Model               | Rekomendasi Penggunaan                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `claude-3.5-sonnet` | Cocok digunakan untuk modul dengan kompleksitas rendah hingga menengah (simple-medium)   |
| `claude-3.7-sonnet` | Direkomendasikan untuk modul dengan kompleksitas menengah hingga tinggi (medium-complex) |

---

## Membuat Prompt Sederhana

Gunakan prompt ini saat kebutuhan modul cukup simpel, di mana properti yang digunakan pada halaman tabel, form, dan detail bersifat seragam.

**Contoh:**

```
- Resource Name: Inventory
- Properties: Item name, category, price, status, location.
- Parent Menu: Management
```

---

## Membuat Prompt Lanjutan

Gunakan pendekatan ini jika kebutuhan properti lebih kompleks dan memerlukan pembagian informasi yang lebih jelas antar halaman (list, detail, form).

### Langkah-langkah:

1. **Buat file prompt baru**

   * Lokasi: `prompt/`
   * Contoh: `prompt/role-module.md`

2. **Isi dengan spesifikasi lengkap fitur dan properti dari modul yang dimaksud.**

Contoh isi file:

```md
# Roles
- resource name: roles 
- parent menu: iam 

## List Page
- Table properties: name, total permission, total users, status (aktif, inactive), created at
- Filter: status

## Detail Page
- Section 1 ("General Information"): name, total permission, total users, status, created at
- Section 2 ("List Permission"): tampilkan dalam bentuk tabel dengan properti: menu, permission (view, delete, create, update)
    - gunakan checkbox yang *disable* untuk permission

## Form
- Section 1 ("General Information"): name, status
- Section 2 ("List Permission"): tampilkan dalam bentuk tabel dengan properti: menu, permission (view, delete, create, update)
    - gunakan checkbox untuk permission
```

3. **Gunakan file tersebut sebagai referensi saat menjalankan prompt.**

Contoh:

```md
Create module roles based on specification mentioned in @prompt/create-module-roles.md
```

4. **Jika ada modul serupa yang bisa dijadikan referensi, sebaiknya sebutkan juga saat menulis prompt.**

Contoh:

```md
Create module roles based on specification mentioned in @prompt/create-module-roles.md. Check the examples at module @src/pages/products
```

---

## Catatan

* Gunakan bahasa yang jelas dan spesifik.
* Pisahkan struktur per halaman untuk memudahkan proses otomatisasi dan pembacaan.
* Simpan semua prompt dalam folder `prompt/` agar mudah ditemukan dan di-maintain.

---

## Pro Tips

* Saat awal-awal penggunaan, **disarankan untuk menonaktifkan fitur auto approve**. Developer dianjurkan untuk mereview setiap langkah yang dilakukan oleh model. Jika terdapat kesalahan seperti:

  * Salah membaca file
  * Salah generate kode
  * Membuat file yang tidak diperlukan

  Jika terjadi kesalahan, Maka langsung hentikan proses dan minta model untuk memperbaiki kesalahannya terlebih dahulu.

* Setelah yakin bahwa model sudah memahami struktur dengan benar dan tidak melakukan kesalahan, **auto approve dapat diaktifkan** untuk mempercepat proses generate.

## Fleksibilitas Prompt

Pembuatan prompt sangat dinamis, tidak wajib mengikuti format yang ada pada contoh. Sesuaikan isi dan struktur prompt dengan kebutuhan spesifik dari masing-masing project dan modul. Tujuan utamanya adalah memberikan informasi yang cukup dan akurat agar model dapat menghasilkan kode yang relevan dan berkualitas.
