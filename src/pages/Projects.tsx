import React from 'react';
import { ClipboardList, PenTool, Briefcase, FileSignature, ArrowRight } from 'lucide-react';

const Projects: React.FC = () => {
  const projectTypes = [
    { id: 'working', icon: ClipboardList, title: 'Рабочий проект', desc: 'Генерация полного рабочего проекта согласно актуальным ГОСТ и СНиП.', color: 'from-blue-500 to-blue-600' },
    { id: 'sketch', icon: PenTool, title: 'Эскизный проект', desc: 'Создание архитектурно-градостроительного решения с 3D-визуализацией.', color: 'from-indigo-500 to-indigo-600' },
    { id: 'feasibility', icon: Briefcase, title: 'ТЭО', desc: 'Технико-экономическое обоснование инвестиционной привлекательности.', color: 'from-cyan-500 to-cyan-600' },
    { id: 'terms', icon: FileSignature, title: 'Шаблон ТЗ', desc: 'Автоматическая подготовка технического задания на проектирование.', color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Рабочие проекты</h2>
          <p className="text-sm text-muted-foreground mt-2">Выберите тип документа для интеллектуальной генерации</p>
        </div>
        <div className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full">v. 2.0 AI</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {projectTypes.map((project) => {
          const Icon = project.icon;
          return (
            <button
              key={project.id}
              className="glass rounded-2xl p-8 text-left hover:scale-[1.02] active:scale-98 transition-all group relative overflow-hidden shadow-sm hover:shadow-xl border-white/5"
            >
              <div className="absolute -top-6 -right-6 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rotate-12 group-hover:rotate-0">
                <Icon size={160} />
              </div>
              
              <div className={`p-4 rounded-xl bg-gradient-to-br ${project.color} w-fit mb-6 text-white shadow-lg group-hover:shadow-indigo-500/20 transition-all`}>
                <Icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed pr-8">{project.desc}</p>
              
              <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                <span>Генерировать</span>
                <ArrowRight size={18} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
