import React, { useState } from 'react';
import { Search, ChevronLeft, Star, FileText } from 'lucide-react';
import { CATEGORIES, DOCUMENTS } from '../data';
import type { Category } from '../types';

const Categories: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [docSearch, setDocSearch] = useState('');

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryDocs = selectedCategory ? (DOCUMENTS[selectedCategory.code] || []) : [];
  const filteredDocs = categoryDocs.filter(doc => 
    doc.title.toLowerCase().includes(docSearch.toLowerCase()) || 
    doc.description.toLowerCase().includes(docSearch.toLowerCase())
  );

  if (selectedCategory) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ChevronLeft size={20} />
          <span>Назад к категориям</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-4xl">{selectedCategory.emoji}</span>
          <h2 className="text-2xl font-bold text-foreground">{selectedCategory.name}</h2>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Поиск в категории..."
            className="input-modern pl-10 h-11"
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="glass rounded-xl p-5 group cursor-pointer hover:shadow-md transition-all relative">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <FileText size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground leading-tight">{doc.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2 bg-muted px-2 py-0.5 rounded">
                      {doc.type}
                    </span>
                  </div>
                </div>
                <button 
                  className="absolute top-5 right-5 text-muted-foreground hover:text-yellow-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Star size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground glass rounded-2xl border-dashed border-2 border-muted/50">
              В этой категории пока нет документов
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <input
          type="text"
          placeholder="Поиск по категориям..."
          className="input-modern pl-12 h-14"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => (
          <button
            key={cat.code}
            onClick={() => setSelectedCategory(cat)}
            className="glass rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all group shadow-sm hover:shadow-md"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
            <span className="text-sm sm:text-base font-semibold text-foreground text-center line-clamp-2 leading-tight">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
