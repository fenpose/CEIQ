import React, { useState } from 'react';
import { Send, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { extractTextFromFile } from '../lib/documentParser';
import { PRESET_QA } from '../data';
import type { QA } from '../types';

const Home: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<QA[]>(PRESET_QA);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    if (!selectedFile) {
      alert("Пожалуйста, прикрепите документ для анализа.");
      return;
    }

    setIsProcessing(true);
    const currentQuestion = question;
    setQuestion('');

    try {
      // 1. Извлекаем текст из документа на клиенте
      const documentText = await extractTextFromFile(selectedFile);
      
      // 2. Отправляем в Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { documentText, question: currentQuestion },
      });

      if (error) throw error;
      
      const newAnswer: QA = {
        question: `[${selectedFile.name}] ${currentQuestion}`,
        answer: data.answer || "Ошибка получения ответа от ИИ.",
      };

      setAnswers([newAnswer, ...answers]);
      setExpandedIndex(0);
    } catch (err: any) {
      console.error(err);
      alert(`Ошибка: ${err.message || 'Не удалось проанализировать документ'}`);
      setQuestion(currentQuestion); // возвращаем вопрос в инпут
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Спросить AI Инженера</h2>
        <div className="relative group">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isProcessing}
            placeholder={selectedFile ? `Анализируем: ${selectedFile.name}. Задайте вопрос...` : "Сначала прикрепите документ, затем задайте вопрос..."}
            className="input-modern min-h-[140px] pr-14 resize-none shadow-sm group-hover:shadow-md transition-shadow disabled:opacity-50"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAsk())}
          />
          <button
            onClick={handleAsk}
            disabled={isProcessing || !selectedFile || !question.trim()}
            className="absolute right-3 bottom-3 p-3 rounded-xl premium-gradient text-white shadow-lg hover:shadow-primary/30 active:scale-90 disabled:opacity-50 transition-all"
            title="Отправить"
          >
            {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </section>

      <section>
        <label className="glass rounded-2xl p-10 border-dashed border-2 border-muted flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-md relative overflow-hidden">
          <input 
            type="file" 
            accept=".pdf,.txt,.docx" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Upload size={28} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {selectedFile ? selectedFile.name : 'Загрузить документ'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Готов к анализу` : 'PDF, TXT или DOCX до 50МБ'}
            </p>
          </div>
        </label>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Ответы экспертов</h2>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">{answers.length} ответов</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {answers.map((qa, index) => (
            <div key={index} className="glass rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-foreground/5 transition-colors"
              >
                <span className="font-medium text-foreground pr-4 leading-tight">{qa.question}</span>
                {expandedIndex === index ? <ChevronUp size={18} className="text-primary shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
              </button>
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-muted/30 pt-4 bg-muted/5 whitespace-pre-wrap">
                      {qa.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
