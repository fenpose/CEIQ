import React from 'react';
import { Home, BookOpen, Calculator as CalcIcon, LayoutDashboard, User, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Главная' },
    { id: 'categories', icon: BookOpen, label: 'Категории' },
    { id: 'calculator', icon: CalcIcon, label: 'Калькулятор' },
    { id: 'projects', icon: LayoutDashboard, label: 'Проекты' },
    { id: 'profile', icon: User, label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none flex justify-center">
      <div className="w-full max-w-md glass rounded-2xl flex items-center justify-around p-2 pointer-events-auto shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

interface HeaderProps {
  onProfileClick: () => void;
  theme: string;
  setTheme: (theme: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick, theme, setTheme }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b-0 border-transparent px-6 py-4 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">AI Инженер</h1>
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">Assistant</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-foreground/5 transition-colors"
          title="Сменить тему"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
        </button>
        <button 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-foreground/5 transition-colors"
        >
          <User size={20} className="text-foreground/80" />
        </button>
      </div>
    </header>
  );
};

const Layout: React.FC<{ children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }> = ({ children, activeTab, setActiveTab }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      <Header 
        onProfileClick={() => setActiveTab('profile')} 
        theme={theme} 
        setTheme={setTheme} 
      />
      <main className="max-w-4xl mx-auto px-6 pt-8 sm:pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;
