# RED CV API - Postman Documentation

## Persyaratan
- [Postman](https://www.postman.com/downloads/) (versi terbaru)

## Instalasi Dokumentasi API

### Langkah 1: Unduh File
1. Unduh `RED_CV_Postman_Collection.json`
2. Unduh `RED_CV_Postman_Environment.json`

### Langkah 2: Import di Postman
1. Buka Postman
2. Klik tombol "Import" di kiri atas
3. Pilih file `RED_CV_Postman_Collection.json`
4. Pilih file `RED_CV_Postman_Environment.json`

### Langkah 3: Konfigurasi Environment
1. Pilih environment "RED CV API Local Environment"
2. Pastikan `base_url` sudah benar (default: `http://localhost:3000`)

## Kategori Endpoint

### Autentikasi
- Register User
- Login
- Get Current User
- Logout

### Analisis CV
- Cek Status API
- Unggah dan Analisis CV

### Riwayat CV
- Dapatkan Riwayat CV
- Dapatkan Detail Riwayat CV
- Hapus Entri Riwayat CV

### Manajemen Admin
- Dapatkan Daftar Pengguna
- Ubah Status Pengguna
- Hapus Pengguna

## Kredensial Default

### Admin
- Username: `admin`
- Password: `melonwater12`

### User
- Username: `user1`
- Password: `melonwater12`

## Cara Menggunakan

1. Pilih environment "RED CV API Local Environment"
2. Pastikan backend sudah berjalan di `http://localhost:3000`
3. Gunakan endpoint "Login" untuk mendapatkan token JWT
4. Token akan otomatis disimpan di variabel `jwt_token`
5. Gunakan token ini untuk mengakses endpoint lain yang memerlukan otorisasi

## Catatan Penting
- Pastikan backend sudah berjalan sebelum menguji endpoint
- Beberapa endpoint memerlukan otorisasi admin
- Unggah file CV hanya mendukung format .docx dan .pdf

## Troubleshooting
- Pastikan base URL benar
- Periksa koneksi internet
- Pastikan backend berjalan dengan benar
- Periksa kredensial login

## Lisensi
MIT 