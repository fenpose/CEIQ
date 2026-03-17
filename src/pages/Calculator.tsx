import React, { useState } from 'react';
import { Calculator as CalcIcon, Droplets, Wind, Snowflake, ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

const CustomSelect: React.FC<{ value: string; options: Option[]; onChange: (v: string) => void }> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="input-modern bg-muted flex items-center justify-between cursor-pointer select-none"
      >
        <span className="font-medium">{selectedOption.label}</span>
        <ChevronDown size={18} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-[100] w-full mt-2 bg-white dark:bg-[#0f172a] border border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 py-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer transition-colors text-sm ${
                  value === option.value 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-foreground font-medium hover:bg-muted'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SNOW_OPTIONS: Option[] = [
  { value: "120", label: "I район (120 кг/м²)" },
  { value: "180", label: "II район (180 кг/м²)" },
  { value: "240", label: "III район (240 кг/м²)" },
  { value: "320", label: "IV район (320 кг/м²)" },
  { value: "400", label: "V район (400 кг/м²)" },
];

const WIND_OPTIONS: Option[] = [
  { value: "23", label: "Ia район (0,23 кПа)" },
  { value: "30", label: "I район (0,30 кПа)" },
  { value: "38", label: "II район (0,38 кПа)" },
  { value: "48", label: "III район (0,48 кПа)" },
  { value: "60", label: "IV район (0,60 кПа)" },
];

const WP_OPTIONS: Option[] = [
  { value: "1.2", label: "Обмазочная (1.2)" },
  { value: "1.1", label: "Рулонная (1.1)" },
  { value: "1.3", label: "Проникающая (1.3)" },
];

const Calculator: React.FC = () => {
  const [snowRegion, setSnowRegion] = useState('400');
  const [snowReliability, setSnowReliability] = useState('1.4');
  const [snowResult, setSnowResult] = useState<string | null>(null);

  const [windRegion, setWindRegion] = useState('38');
  const [buildingHeight, setBuildingHeight] = useState('10');
  const [windResult, setWindResult] = useState<string | null>(null);

  const [wpArea, setWpArea] = useState('100');
  const [wpType, setWpType] = useState('1.2');
  const [wpResult, setWpResult] = useState<string | null>(null);

  const handleSnowCalc = () => {
    const res = (parseFloat(snowRegion) * parseFloat(snowReliability)).toFixed(2);
    setSnowResult(res);
  };

  const handleWindCalc = () => {
    const height = parseFloat(buildingHeight) || 10;
    let heightCoeff = 1.0;
    if (height <= 10) heightCoeff = 1.0;
    else if (height <= 20) heightCoeff = 1.25;
    else if (height <= 40) heightCoeff = 1.5;
    else heightCoeff = 1.8;
    
    const res = (parseFloat(windRegion) * heightCoeff / 100).toFixed(3);
    setWindResult(res);
  };

  const handleWpCalc = () => {
    const res = (parseFloat(wpArea) * parseFloat(wpType)).toFixed(2);
    setWpResult(res);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <CalcIcon className="text-primary" size={28} />
        <h2 className="text-2xl font-bold text-foreground">Инженерные калькуляторы</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Snow Load */}
        <section className="glass rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Snowflake size={22} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Расчет снеговой нагрузки</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Снеговой район</label>
              <CustomSelect 
                value={snowRegion} 
                options={SNOW_OPTIONS}
                onChange={setSnowRegion}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Коэфф. надежности</label>
              <input 
                type="number" 
                value={snowReliability}
                onChange={(e) => setSnowReliability(e.target.value)}
                step="0.1"
                className="input-modern bg-muted"
              />
            </div>
          </div>
          
          <button onClick={handleSnowCalc} className="w-full py-4 premium-gradient rounded-xl font-bold text-white shadow-lg hover:shadow-primary/30 transition-all active:scale-95">Рассчитать</button>
          
          {snowResult && (
            <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-xl animate-in zoom-in duration-300">
              <p className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em] mb-1">Расчетное значение S₀:</p>
              <p className="text-3xl font-black text-green-500">{snowResult} <small className="text-sm font-bold text-green-500/60 ml-1">кг/м²</small></p>
            </div>
          )}
        </section>

        {/* Wind Load */}
        <section className="glass rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Wind size={22} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Расчет ветровой нагрузки</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ветровой район</label>
              <CustomSelect 
                value={windRegion} 
                options={WIND_OPTIONS}
                onChange={setWindRegion}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Высота здания (м)</label>
              <input 
                type="number" 
                value={buildingHeight}
                onChange={(e) => setBuildingHeight(e.target.value)}
                className="input-modern bg-muted"
              />
            </div>
          </div>
          
          <button onClick={handleWindCalc} className="w-full py-4 premium-gradient rounded-xl font-bold text-white shadow-lg hover:shadow-primary/30 transition-all active:scale-95">Рассчитать</button>
          
          {windResult && (
            <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-xl animate-in zoom-in duration-300">
              <p className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em] mb-1">Давление ветра W₀:</p>
              <p className="text-3xl font-black text-green-500">{windResult} <small className="text-sm font-bold text-green-500/60 ml-1">кПа</small></p>
            </div>
          )}
        </section>

        {/* Waterproofing */}
        <section className="glass rounded-2xl p-6 sm:p-8 space-y-6 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Droplets size={22} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Гидроизоляция</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Площадь (м²)</label>
              <input 
                type="number" 
                value={wpArea}
                onChange={(e) => setWpArea(e.target.value)}
                className="input-modern bg-muted"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Тип</label>
              <CustomSelect 
                value={wpType} 
                options={WP_OPTIONS}
                onChange={setWpType}
              />
            </div>
          </div>
          
          <button onClick={handleWpCalc} className="w-full py-4 premium-gradient rounded-xl font-bold text-white shadow-lg hover:shadow-primary/30 transition-all active:scale-95">Рассчитать</button>
          
          {wpResult && (
            <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-xl animate-in zoom-in duration-300">
              <p className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em] mb-1">Необходимый объем:</p>
              <p className="text-3xl font-black text-green-500">{wpResult} <small className="text-sm font-bold text-green-500/60 ml-1">м²</small></p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Calculator;

