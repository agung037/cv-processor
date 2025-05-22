const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

/**
 * Extract text from a DOCX file
 * @param {string} filePath Path to the DOCX file
 * @returns {Promise<string>} Extracted text
 */
const extractFromDocx = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
};

/**
 * Extract text from a PDF file
 * @param {string} filePath Path to the PDF file
 * @returns {Promise<string>} Extracted text
 */
const extractFromPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file');
  }
};

/**
 * Extract text from a file based on its extension
 * @param {string} filePath Path to the file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  
  if (extension === '.docx') {
    return extractFromDocx(filePath);
  } else if (extension === '.pdf') {
    return extractFromPdf(filePath);
  } else {
    throw new Error('Unsupported file format. Only DOCX and PDF are supported.');
  }
};

module.exports = {
  extractTextFromFile
}; 