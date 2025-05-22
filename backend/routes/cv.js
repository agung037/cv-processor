const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { extractTextFromFile } = require('../utils/fileExtractor');
const { generateCVAdvice } = require('../services/cvAnalyzerService');
const { authenticate } = require('../middleware/authMiddleware');
const { getDb } = require('../models/database');

const uploadDir = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Route configuration for CV processing
 */
module.exports = [
  {
    method: 'GET',
    path: '/api/status',
    handler: (request, h) => {
      return {
        status: 'ok',
        message: 'CV Processor API is running',
        timestamp: new Date().toISOString()
      };
    }
  },
  {
    method: 'POST',
    path: '/api/cv/analyze',
    options: {
      pre: [{ method: authenticate }],
      payload: {
        output: 'file',
        parse: true,
        multipart: true,
        maxBytes: 20 * 1024 * 1024, // 20MB limit
        allow: 'multipart/form-data'
      },
    },
    handler: async (request, h) => {
      try {
        const { cv_file } = request.payload;
        
        if (!cv_file) {
          return h.response({ error: 'Tidak ada file yang dipilih' }).code(400);
        }
        
        // Validate file extension
        const fileExt = path.extname(cv_file.filename).toLowerCase();
        if (!['.docx', '.pdf'].includes(fileExt)) {
          return h.response({ error: 'Hanya file DOCX dan PDF yang didukung' }).code(400);
        }
        
        // Generate a unique filename for the uploaded file
        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Save the file
        const fileStream = fs.createWriteStream(filePath);
        
        await new Promise((resolve, reject) => {
          fileStream.on('error', (err) => {
            fs.unlinkSync(cv_file.path);
            reject(err);
          });
          
          fileStream.on('finish', () => {
            resolve();
          });
          
          fs.createReadStream(cv_file.path).pipe(fileStream);
        });
        
        // Extract text from the file
        const cvText = await extractTextFromFile(filePath);
        
        // Generate advice - this returns a markdown object
        const advice = await generateCVAdvice(cvText);
        
        // Save to history
        const db = getDb();
        const historyResult = await db.run(
          `INSERT INTO cv_history 
           (user_id, filename, original_filename, analysis_result) 
           VALUES (?, ?, ?, ?)`,
          [
            request.user.id, 
            fileName, 
            cv_file.filename, 
            JSON.stringify(advice)
          ]
        );
        
        // Clean up uploaded file after saving history
        // Uncomment if you want to delete the file after processing
        // fs.unlinkSync(filePath);
        
        return { 
          advice,
          historyId: historyResult.lastID
        };
      } catch (error) {
        console.error('Error processing CV:', error);
        return h.response({ 
          error: `Error memproses file: ${error.message}`,
          advice: null
        }).code(500);
      }
    }
  }
]; 