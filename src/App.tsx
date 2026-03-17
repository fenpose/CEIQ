import { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Calculator from './pages/Calculator';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'categories': return <Categories />;
      case 'calculator': return <Calculator />;
      case 'projects': return <Projects />;
      case 'profile': return <Profile />;
      default: return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
