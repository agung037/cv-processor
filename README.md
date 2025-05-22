# RED CV

Aplikasi untuk menganalisis CV dan memberikan saran profesional menggunakan AI. Dibangun dengan React dan Hapi.js.

## Struktur Aplikasi

- **Backend**: API berbasis Hapi.js yang memproses file CV dan berinteraksi dengan API Groq
- **Frontend**: Antarmuka pengguna React dengan Material UI

## Persyaratan

- Node.js v14+ dan npm
- API key dari Groq

## Instalasi

### Backend

1. Masuk ke direktori backend:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Buat file `.env` (opsional):
   ```
   PORT=3000
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=qwen-qwq-32b
   ```

4. Jalankan server:
   ```
   npm run dev
   ```

### Frontend

1. Masuk ke direktori frontend:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Jalankan aplikasi frontend:
   ```
   npm start
   ```

4. Buka browser dan akses `http://localhost:3001`

## Sistem Autentikasi

Aplikasi ini menggunakan sistem autentikasi berbasis token JWT dengan SQLite sebagai database. Ada dua peran pengguna:

- **Admin**: Memiliki akses untuk mengelola pengguna lain
- **User**: Dapat menggunakan layanan analisis CV

### Akun Default

Berikut adalah akun default yang tersedia setelah instalasi:

1. **Admin**
   - Username: `admin`
   - Password: `melonwater12`
   - Status: Aktif

2. **User 1**
   - Username: `user1`
   - Password: `melonwater12`
   - Status: Aktif

3. **User 2**
   - Username: `user2`
   - Password: `melonwater12`
   - Status: Tidak aktif

## Penggunaan Akun Admin

Sebagai admin, Anda memiliki kemampuan untuk mengelola pengguna dalam sistem. Berikut cara menggunakan akun admin:

1. **Login sebagai Admin**:
   - Masuk menggunakan username `admin` dan password `melonwater12`
   - Setelah berhasil login, Anda akan melihat menu "Kelola Pengguna" di navigasi

2. **Mengelola Pengguna**:
   - Klik menu "Kelola Pengguna" untuk masuk ke halaman manajemen pengguna
   - Anda dapat melihat daftar semua pengguna (kecuali admin lain)
   - Untuk setiap pengguna, Anda dapat:
     - Mengaktifkan/menonaktifkan akun mereka dengan tombol "Aktifkan" atau "Nonaktifkan"
     - Menghapus akun mereka dengan tombol hapus (ikon tempat sampah)

3. **Memverifikasi Pendaftaran Baru**:
   - Ketika pengguna baru mendaftar, akun mereka secara default tidak aktif
   - Anda perlu mengaktifkan akun baru melalui halaman "Kelola Pengguna" sebelum mereka dapat menggunakan aplikasi

## Penggunaan

1. Login dengan akun yang aktif (admin atau user yang telah diaktifkan)
2. Unggah file CV Anda (format .docx atau .pdf)
3. Sistem akan mengekstrak teks dari CV dan mengirimkannya ke API Groq
4. Hasil analisis akan ditampilkan secara profesional
5. Anda dapat menyimpan hasil analisis sebagai file teks
6. Riwayat analisis CV tersimpan dan dapat diakses kembali

### Fitur Tambahan

- **Riwayat CV**: Pengguna dapat melihat riwayat analisis CV mereka
- **Manajemen Pengguna**: Admin dapat mengaktifkan, menonaktifkan, atau menghapus akun pengguna
- **Sistem Registrasi**: Pengguna baru dapat mendaftar tetapi perlu diaktivasi oleh admin

## Fitur

- Ekstraksi teks dari file DOCX dan PDF
- Analisis CV menggunakan model AI canggih (Qwen-QwQ-32B)
- Antarmuka pengguna yang ramah dan responsif
- Dukungan bahasa Indonesia
- Sistem autentikasi dan otorisasi

## Kustomisasi

Anda dapat mengubah model AI yang digunakan dengan mengedit `GROQ_MODEL` di file `.env` atau `config.js`.

## Lisensi

MIT 