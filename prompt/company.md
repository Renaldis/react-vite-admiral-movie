# Karwayan

- Resource Name: Perusahaan
- Parent Menu: Master Data Pengaturan
- Feature: Read Data, Sync Data, Edit Data

## List Page

- Table:
    - Column: Kode, Nama Perusahaan, Alamat, Aksi (Edit Icon).
    - Content for column Nama Perusahan: Logo, Name.
    - Go to detail when click Kode.
- Filter: -

## Detail Page
- Section 1: Detil Perusahaan
  - Fields: Kode, Nama Perusahaan, Alamat, Aksi (Edit Icon).

## Form

- Fields: ID (Disabled), Kode, Perusahaan(disabled), Alamat(disabled)
- all field required. only Kode is enabled.


# Understand API 
Check this api contract as your reference to create api definiion and types.

```json
{
  "status_code": 200,
  "data": {
    "id": "be9ebfba-6667-41d4-9bbb-bd06124bc377",
    "name": "PT Petrokimia Gresik",
    "code": "PKG001",
    "address": "Jl. Jenderal Ahmad Yani - Gresik 61119",
  },
  "version": "1.0.0"
}
```
