const axios = require('axios');
const config = require('../config');

/**
 * Generate professional CV advice using Groq API
 * @param {string} cvText Text extracted from the CV
 * @returns {Promise<object>} Professional advice in markdown format
 */
const generateCVAdvice = async (cvText) => {
  try {
    const prompt = `Anda adalah konsultan profesional CV/resume. Di bawah ini ada teks CV. Tolong analisis dan berikan saran profesional dan mendalam tentang CV tersebut dalam format markdown yang terstruktur. PENTING: Berikan SELURUH respons dalam Bahasa Indonesia saja dan gunakan emoji yang relevan untuk membuat hasil analisis lebih menarik dan mudah dibaca.

TEKS CV:
${cvText.substring(0, 2500)}

Berikan analisis komprehensif dengan format berikut:

# 📄 Analisis CV Profesional

## 📋 Struktur
[Analisis lengkap tentang struktur CV, termasuk format, organisasi informasi, dan kelengkapan komponen standar CV]

## 💼 Pekerjaan yang Cocok
- **[Nama Posisi 1]** ✅ [Alasan posisi ini cocok berdasarkan pengalaman dan keterampilan]
- **[Nama Posisi 2]** ✅ [Alasan posisi ini cocok berdasarkan pengalaman dan keterampilan]
- **[Nama Posisi 3]** ✅ [Alasan posisi ini cocok berdasarkan pengalaman dan keterampilan]
- **[Nama Posisi 4]** ✅ [Alasan posisi ini cocok berdasarkan pengalaman dan keterampilan]
- **[Nama Posisi 5]** ✅ [Alasan posisi ini cocok berdasarkan pengalaman dan keterampilan]

## 🔍 Area Perbaikan
### 🔸 [Area 1]
**Detail**: [Penjelasan detail tentang apa yang perlu diperbaiki]
**Saran**: [Saran spesifik untuk perbaikan]

### 🔸 [Area 2]
**Detail**: [Penjelasan detail tentang apa yang perlu diperbaiki]
**Saran**: [Saran spesifik untuk perbaikan]

### 🔸 [Area 3]
**Detail**: [Penjelasan detail tentang apa yang perlu diperbaiki]
**Saran**: [Saran spesifik untuk perbaikan]

## 📊 Penilaian Detail
PENTING: Gunakan format tabel markdown yang tepat seperti berikut, dengan pipe (|) sebagai pemisah kolom dan header yang dipisahkan dengan garis. Pastikan tabel mudah dibaca.

| Aspek | Skor | Komentar |
|-------|------|----------|
| Presentasi & Format | 80/100 | [Komentar singkat] |
| Kejelasan Informasi | 80/100 | [Komentar singkat] |
| Relevansi Pengalaman | 80/100 | [Komentar singkat] |
| Keseimbangan Konten | 80/100 | [Komentar singkat] |
| Penggunaan Kata Kunci | 80/100 | [Komentar singkat] |
| Dampak Keseluruhan | 80/100 | [Komentar singkat] |
| Kesesuaian Standar Industri | 80/100 | [Komentar singkat] |

## 🏆 Skor Keseluruhan: [85]/100
[Deskripsi kekuatan utama CV ini]

## 👨‍💼 Nasehat Personal

### 💪 Kekuatan
[Ringkasan kekuatan utama dari CV ini]

### 🚧 Kelemahan
[Ringkasan kelemahan utama dari CV ini]

### 🚀 Tips Pencarian Kerja
[Tips konkret untuk mencari pekerjaan di sektor yang paling cocok berdasarkan analisis CV]

Pastikan format markdown yang digunakan mudah dibaca dan terstruktur dengan baik. Gunakan elemen markdown seperti heading, list, bold, italic, dan tabel untuk meningkatkan keterbacaan. SELURUH RESPONS HARUS DALAM BAHASA INDONESIA DAN GUNAKAN EMOJI SECARA KONSISTEN.`;

    const response = await axios.post(
      config.groq.apiUrl,
      {
        model: config.groq.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.groq.apiKey}`
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const markdownContent = response.data.choices[0].message.content;
      
      // Log the first part of the content for debugging
      console.log('Groq response first 100 chars:', markdownContent.substring(0, 100));
      
      // Return the raw markdown content
      return { markdown: markdownContent };
    } else {
      console.error('Invalid or missing Groq API response structure:', response.data);
      
      // Return a fallback markdown response
      return { 
        markdown: `# 📄 Analisis CV Profesional

## ⚠️ Analisis Tidak Tersedia

Maaf, kami tidak dapat menganalisis CV Anda saat ini karena masalah teknis. Silakan coba lagi nanti.

### Langkah Selanjutnya
- 🔄 Periksa koneksi internet Anda
- 📁 Pastikan CV Anda dalam format yang didukung (PDF)
- ⏱️ Coba lagi dalam beberapa saat
` 
      };
    }
  } catch (error) {
    console.error('Error generating CV advice:', error);
    
    // Check if it's an axios error with response data
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);
    }
    
    // Return a fallback markdown response for errors
    return { 
      markdown: `# 📄 Analisis CV Profesional

## ⚠️ Analisis Tidak Tersedia

Maaf, kami tidak dapat menganalisis CV Anda saat ini karena masalah teknis. Silakan coba lagi nanti.

### Langkah Selanjutnya
- 🔄 Periksa koneksi internet Anda
- 📁 Pastikan CV Anda dalam format yang didukung (PDF)
- ⏱️ Coba lagi dalam beberapa saat
`
    };
  }
};

/**
 * Format raw text response to match our JSON structure
 * @param {string} text Raw text from Groq
 * @returns {object} Formatted JSON object
 */
const formatRawTextToJson = (text) => {
  // Extract sections if possible using regex
  const strukturMatch = text.match(/\*\*1\.\s+Struktur:\*\*([\s\S]*?)(?=\*\*2\.|$)/i);
  const pekerjaanMatch = text.match(/\*\*2\.\s+Pekerjaan yang Cocok:\*\*([\s\S]*?)(?=\*\*3\.|$)/i);
  const perbaikanMatch = text.match(/\*\*3\.\s+Area Perbaikan:\*\*([\s\S]*?)(?=\*\*4\.|$)/i);
  const penilaianMatch = text.match(/\*\*4\.\s+Penilaian:\*\*([\s\S]*?)(?=\*\*5\.|$)/i);
  const skorMatch = text.match(/\*\*5\.\s+Skor Keseluruhan:\*\*([\s\S]*?)(?=\*\*6\.|$)/i);
  const nasehatMatch = text.match(/\*\*6\.\s+Nasehat Personal:\*\*([\s\S]*?)$/i);
  
  // Parse job recommendations
  const jobRecommendations = [];
  if (pekerjaanMatch) {
    const jobText = pekerjaanMatch[1];
    const jobs = jobText.match(/\*\s+(.*?)(?=\*\s+|$)/g) || [];
    jobs.forEach(job => {
      const cleaned = job.replace(/\*/g, '').trim();
      if (cleaned) {
        jobRecommendations.push({
          posisi: cleaned.split(':')[0] || cleaned,
          alasan: cleaned.split(':')[1] || "Sesuai dengan pengalaman dan keterampilan dalam CV"
        });
      }
    });
  }
  
  // Parse improvement areas
  const improvementAreas = [];
  if (perbaikanMatch) {
    const areasText = perbaikanMatch[1];
    const areas = areasText.match(/\*\s+(.*?)(?=\*\s+|$)/g) || [];
    areas.forEach(area => {
      const cleaned = area.replace(/\*/g, '').trim();
      if (cleaned) {
        improvementAreas.push({
          area: cleaned.split(':')[0] || "Area Perbaikan",
          detail: cleaned,
          saran: "Perhatikan area ini untuk meningkatkan kualitas CV Anda"
        });
      }
    });
  }
  
  // Parse ratings
  const ratings = {};
  if (penilaianMatch) {
    const ratingsText = penilaianMatch[1];
    const ratingLines = ratingsText.match(/\*\s+(.*?):\s+(\d+)/g) || [];
    
    ratingLines.forEach(line => {
      const match = line.match(/\*\s+(.*?):\s+(\d+)(.*)/) || [];
      if (match.length >= 3) {
        const category = match[1].trim();
        const score = parseInt(match[2]) || 75;
        const comment = match[3] || "";
        
        // Convert category to camelCase key
        let key = category.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
          
        ratings[key] = {
          skor: score,
          komentar: comment.trim()
        };
      }
    });
  }
  
  // Extract overall score
  let overallScore = 75;
  let strengths = "CV memiliki struktur yang baik dan menunjukkan pengalaman yang relevan";
  
  if (skorMatch) {
    const skorText = skorMatch[1];
    const scoreMatch = skorText.match(/Skor keseluruhan:\s*(\d+)/i);
    if (scoreMatch) {
      overallScore = parseInt(scoreMatch[1]) || 75;
    }
    
    // Try to extract strengths
    const strengthsLines = skorText.split('\n').filter(line => 
      !line.includes('Skor keseluruhan') && line.trim() !== '');
      
    if (strengthsLines.length > 0) {
      strengths = strengthsLines.join(' ').trim();
    }
  }
  
  // Ensure all assessment categories are present
  const ensureRatingCategory = (key, label) => {
    if (!ratings[key]) {
      ratings[key] = {
        skor: 75,
        komentar: `Penilaian untuk ${label}`
      };
    }
  };
  
  ensureRatingCategory('presentasi_format', 'Presentasi dan Format');
  ensureRatingCategory('kejelasan_informasi', 'Kejelasan Informasi');
  ensureRatingCategory('relevansi_pengalaman', 'Relevansi Pengalaman');
  ensureRatingCategory('keseimbangan_konten', 'Keseimbangan Konten');
  ensureRatingCategory('penggunaan_kata_kunci', 'Penggunaan Kata Kunci');
  ensureRatingCategory('dampak_keseluruhan', 'Dampak Keseluruhan');
  ensureRatingCategory('kesesuaian_standar_industri', 'Kesesuaian dengan Standar Industri');
  
  // Extract nasehat personal
  let nasehatPersonal = {
    kekuatan: "CV menunjukkan beberapa kekuatan yang dapat dimanfaatkan dalam pencarian kerja",
    kelemahan: "Terdapat beberapa area yang dapat ditingkatkan untuk memaksimalkan peluang kerja",
    tips_pencarian_kerja: "Sesuaikan CV dengan posisi yang dilamar dan gunakan jaringan profesional untuk mendapatkan referensi"
  };
  
  if (nasehatMatch) {
    const nasehatText = nasehatMatch[1];
    
    // Try to extract kekuatan
    const kekuatanMatch = nasehatText.match(/Kekuatan:(.*?)(?=Kelemahan:|Tips|$)/is);
    if (kekuatanMatch && kekuatanMatch[1]) {
      nasehatPersonal.kekuatan = kekuatanMatch[1].trim();
    }
    
    // Try to extract kelemahan
    const kelemahanMatch = nasehatText.match(/Kelemahan:(.*?)(?=Kekuatan:|Tips|$)/is);
    if (kelemahanMatch && kelemahanMatch[1]) {
      nasehatPersonal.kelemahan = kelemahanMatch[1].trim();
    }
    
    // Try to extract tips
    const tipsMatch = nasehatText.match(/Tips.*?:(.*?)$/is);
    if (tipsMatch && tipsMatch[1]) {
      nasehatPersonal.tips_pencarian_kerja = tipsMatch[1].trim();
    }
  }

  return {
    struktur: strukturMatch ? strukturMatch[1].trim() : "CV memiliki struktur yang cukup baik, namun dapat ditingkatkan untuk kemudahan pembacaan.",
    pekerjaan_cocok: jobRecommendations.length > 0 ? jobRecommendations : [
      { posisi: "Web Developer", alasan: "Berdasarkan keterampilan teknis yang tercantum dalam CV" },
      { posisi: "Data Analyst", alasan: "Sesuai dengan pengalaman analitis yang ditunjukkan" },
      { posisi: "Project Manager", alasan: "Menunjukkan kemampuan koordinasi dan manajemen" }
    ],
    area_perbaikan: improvementAreas.length > 0 ? improvementAreas : [
      { area: "Pengalaman Kerja", detail: "Bagian pengalaman kerja perlu lebih spesifik", saran: "Tambahkan metrik dan pencapaian konkret" },
      { area: "Keterampilan", detail: "Daftar keterampilan terlalu umum", saran: "Sesuaikan keterampilan dengan posisi yang dilamar" },
      { area: "Pendidikan", detail: "Informasi pendidikan kurang lengkap", saran: "Tambahkan prestasi akademik relevan" }
    ],
    penilaian: ratings,
    skor_keseluruhan: {
      nilai: overallScore,
      kekuatan_utama: strengths
    },
    nasehat_personal: nasehatPersonal
  };
};

/**
 * Get fallback advice when API fails
 * @returns {object} Fallback advice
 */
const getFallbackAdvice = () => {
  return {
    struktur: "CV memiliki struktur dasar yang baik, dengan bagian-bagian standar seperti informasi kontak, pengalaman kerja, pendidikan, dan keterampilan. Format tampak rapi dan mudah dibaca.",
    pekerjaan_cocok: [
      { posisi: "Web Developer", alasan: "Berdasarkan keterampilan teknis yang tercantum dalam CV" },
      { posisi: "Data Analyst", alasan: "Sesuai dengan pengalaman analitis yang ditunjukkan" },
      { posisi: "Project Manager", alasan: "Menunjukkan kemampuan koordinasi dan manajemen" }
    ],
    area_perbaikan: [
      { area: "Pengalaman Kerja", detail: "Bagian pengalaman kerja perlu lebih spesifik", saran: "Tambahkan metrik dan pencapaian konkret" },
      { area: "Keterampilan", detail: "Daftar keterampilan terlalu umum", saran: "Sesuaikan keterampilan dengan posisi yang dilamar" },
      { area: "Pendidikan", detail: "Informasi pendidikan kurang lengkap", saran: "Tambahkan prestasi akademik relevan" }
    ],
    penilaian: {
      presentasi_format: { skor: 80, komentar: "Format CV sudah baik dan mudah dibaca" },
      kejelasan_informasi: { skor: 75, komentar: "Informasi cukup jelas tetapi bisa lebih spesifik" },
      relevansi_pengalaman: { skor: 85, komentar: "Pengalaman yang ditampilkan relevan dengan bidang" },
      keseimbangan_konten: { skor: 70, komentar: "Beberapa bagian terlalu ringkas" },
      penggunaan_kata_kunci: { skor: 75, komentar: "Sudah menggunakan kata kunci industri" },
      dampak_keseluruhan: { skor: 80, komentar: "CV memberikan kesan profesional" },
      kesesuaian_standar_industri: { skor: 85, komentar: "Sesuai dengan standar industri saat ini" }
    },
    skor_keseluruhan: {
      nilai: 80,
      kekuatan_utama: "CV menunjukkan pengalaman yang relevan dan keterampilan yang baik. Presentasi profesional dan sesuai dengan standar industri."
    },
    nasehat_personal: {
      kekuatan: "CV menunjukkan pengalaman yang relevan dan terstruktur dengan baik. Format profesional dan mudah dibaca merupakan kekuatan utama.",
      kelemahan: "Beberapa bagian masih kurang detail dan spesifik. Pencapaian kuantitatif perlu ditambahkan untuk memperkuat posisi.",
      tips_pencarian_kerja: "Fokus melamar di perusahaan teknologi dan analisis data. Sesuaikan CV untuk setiap posisi yang dilamar dengan menekankan keterampilan yang relevan. Bangun portofolio online dan perluas jaringan profesional melalui LinkedIn dan komunitas industri."
    }
  };
};

module.exports = {
  generateCVAdvice
}; 