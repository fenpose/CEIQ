import React, { useState } from 'react';
import { User as UserIcon, Mail, Building, Crown, Trash2, Star, Settings, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || 'Инженер',
    email: user?.email || '',
    org: user?.user_metadata?.organization || 'Инженерная Компания'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: profile.name,
          organization: profile.org
        }
      });
      
      if (error) throw error;
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-foreground">
      <section className="premium-gradient rounded-3xl p-8 relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
          <Crown size={180} />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full glass flex items-center justify-center text-4xl font-black bg-white/20 text-white shadow-2xl">
            {profile.name[0]}
          </div>
          <div className="text-center sm:text-left flex-1 space-y-2">
            <h3 className="text-3xl font-black text-white leading-tight">PREMIUM PLAN</h3>
            <p className="text-blue-100/80 font-medium">Ваш аккаунт синхронизирован с облаком AI Инженер</p>
            <div className="pt-4 flex flex-wrap justify-center sm:justify-start gap-4">
              <button className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg hover:shadow-white/20">
                PRO ФУНКЦИИ
              </button>
              <button 
                onClick={() => signOut()}
                className="px-8 py-3 bg-destructive text-white rounded-xl font-black text-sm hover:bg-destructive/90 active:scale-95 transition-all shadow-lg flex items-center gap-2"
              >
                <LogOut size={16} />
                ВЫЙТИ
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h3 className="text-xl font-bold px-1 flex items-center gap-2 text-foreground">
            <Settings size={22} className="text-primary" />
            Настройки профиля
          </h3>
          <div className="glass rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <UserIcon size={12} /> Имя инженера
              </label>
              <input 
                className="input-modern bg-muted/30"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Mail size={12} /> Контактный Email
              </label>
              <input 
                className="input-modern bg-muted/30 disabled:opacity-50"
                value={profile.email}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Building size={12} /> Организация
              </label>
              <input 
                className="input-modern bg-muted/30"
                value={profile.org}
                onChange={(e) => setProfile({...profile, org: e.target.value})}
              />
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all mt-4 border-none outline-none flex items-center justify-center gap-2 ${
                saveStatus === 'success' 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                  : saveStatus === 'error'
                  ? 'bg-destructive text-white shadow-destructive-500/20'
                  : 'bg-primary text-primary-foreground shadow-primary-200/40 hover:shadow-primary/40'
              }`}
            >
              {isSaving ? 'Сохранение...' : saveStatus === 'success' ? 'Сохранено!' : saveStatus === 'error' ? 'Ошибка' : 'Сохранить данные'}
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold px-1 flex items-center gap-2 text-foreground">
            <Star className="text-yellow-500 fill-yellow-500" size={22} /> Избранное
          </h3>
          <div className="space-y-4">
            {[
              { id: 1, title: 'СП 20.13330.2016', desc: 'Своды правил: Нагрузки и воздействия' },
              { id: 2, title: 'НТП РК 01-01-3.1', desc: 'Нормативно-технические пособия РК' }
            ].map((item) => (
              <div key={item.id} className="glass rounded-2xl p-5 flex items-center justify-between group hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground leading-tight">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <div className="glass rounded-2xl p-6 border-dashed border-2 border-muted/50 flex flex-col items-center justify-center text-center py-10">
              <p className="text-xs font-bold text-muted-foreground/30 uppercase tracking-widest">Все данные в облаке</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
