import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up the PDF.js worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set up the PDF.js worker using Vite's asset loader
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  try {
    if (extension === 'txt') {
      const text = await file.text();
      if (!text.trim()) throw new Error('Файл пуст.');
      return text;
    } 
    
    if (extension === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: true,
        isEvalSupported: false 
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      // Extract text from the first 50 pages to keep it manageable
      const numPages = Math.min(pdf.numPages, 50);
      
      for (let i = 1; i <= numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n\n';
        } catch (pageError) {
          console.warn(`Error on page ${i}:`, pageError);
        }
      }
      
      if (!fullText.trim()) throw new Error('В PDF-файле не найден текст (возможно, это изображение без OCR).');
      return fullText;
    } 
    
    if (extension === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (!result.value.trim()) throw new Error('В DOCX-файле не найден текст.');
      return result.value;
    }

    throw new Error('Неподдерживаемый формат. Пожалуйста, используйте PDF, TXT или DOCX.');
  } catch (error: any) {
    console.error('Error extracting text:', error);
    const message = error.message.includes('worker') 
      ? 'Ошибка загрузки модуля обработки PDF. Пожалуйста, обновите страницу.'
      : error.message;
    throw new Error(`Ошибка разбора файла: ${message}`);
  }
};
