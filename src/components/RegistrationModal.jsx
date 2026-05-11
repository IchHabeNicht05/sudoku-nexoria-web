import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Users, School, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function RegistrationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(''); // PŘIDÁNO: Stav pro kód
  
  const [formData, setFormData] = useState({
    team_name: '',
    school: '',
    captain_name: '',
    member_2: '',
    member_3: '',
    category: 'Střední školy',
    email: ''
  });

  if (!isOpen) return null;

  const nextStep = () => {
    if (step === 1) {
        if (!formData.team_name || !formData.school) {
        alert("Vyplň prosím název týmu a školu.");
        return;
        }
    }
    if (step === 2) {
        if (!formData.captain_name || !formData.member_2 || !formData.member_3) {
        alert("Vyplň prosím jména všech tří členů týmu.");
        return;
        }
    }
    setStep(s => s + 1);
    };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ZMĚNA: Přidán .select() pro získání vygenerovaného access_code
    const { data, error } = await supabase
      .from('registrations')
      .insert([formData])
      .select();

    setLoading(false);

    if (error) {
      alert("Chyba: " + error.message);
    } else {
      // ZMĚNA: Uložíme vygenerovaný kód z odpovědi
      if (data && data[0]) {
        setGeneratedCode(data[0].access_code);
      }
      setIsSuccess(true);
      // ZMĚNA: Odstraněn setTimeout, aby uživatel viděl svůj kód!
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // PŘIDÁNO: Funkce pro kompletní reset při zavření po úspěchu
  const handleFinalClose = () => {
    setIsSuccess(false);
    setStep(1);
    setGeneratedCode('');
    setFormData({ team_name: '', school: '', captain_name: '', member_2: '', member_3: '', category: 'Střední školy', email: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={isSuccess ? handleFinalClose : onClose} 
          className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        />

        <motion.div 
          initial={{ scale: 0.9, y: 20 }} 
          animate={{ scale: 1, y: 0 }} 
          exit={{ scale: 0.9, y: 20 }} 
          className="relative w-full max-w-lg glass-card border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-0 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                Registrace <span className="text-gradient">týmu</span>
              </h2>
              {!isSuccess && (
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-accent-blue' : 'bg-white/10'}`} />
                  ))}
                </div>
              )}
            </div>
            <button onClick={isSuccess ? handleFinalClose : onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  className="py-6 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold uppercase italic tracking-tight">Vítejte v turnaji!</h3>
                    <p className="text-gray-400 text-sm">Registrace proběhla úspěšně.</p>
                  </div>

                  {/* ZMĚNA: UI pro zobrazení přístupového kódu */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Tvůj přístupový kód</p>
                    <p className="text-4xl font-mono text-accent-blue tracking-[0.15em] font-black">
                      {generatedCode || '------'}
                    </p>
                    <p className="text-[10px] text-gray-500 pt-2 leading-relaxed italic">
                      Tento kód si uložte. Budete jej potřebovat <br /> pro přihlášení do sekce kapitána.
                    </p>
                  </div>

                  <button 
                    onClick={handleFinalClose}
                    className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest"
                  >
                    Rozumím a zavřít
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* KROK 1: O TÝMU */}
                  {step === 1 && (
                    <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="flex items-center gap-3 text-accent-blue mb-2 font-bold uppercase text-xs tracking-widest">
                        <School size={16} /> Základní informace
                      </div>
                      <input 
                        required 
                        placeholder="Název týmu" 
                        className="input-field" 
                        value={formData.team_name} 
                        onChange={e => setFormData({...formData, team_name: e.target.value})} 
                      />
                      <input 
                        required 
                        placeholder="Škola / Instituce" 
                        className="input-field" 
                        value={formData.school} 
                        onChange={e => setFormData({...formData, school: e.target.value})} 
                      />
                      <button 
                        type="button" 
                        onClick={nextStep} 
                        disabled={!formData.team_name || !formData.school}
                        className="btn-next disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                        Složit tým <ChevronRight size={18} />
                        </button>
                    </motion.div>
                  )}

                  {/* KROK 2: ČLENOVÉ */}
                  {step === 2 && (
                    <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="flex items-center gap-3 text-accent-purple mb-2 font-bold uppercase text-xs tracking-widest">
                        <Users size={16} /> Členové týmu (3)
                      </div>
                      <input required placeholder="Jméno kapitána" className="input-field border-accent-blue/30" value={formData.captain_name} onChange={e => setFormData({...formData, captain_name: e.target.value})} />
                      <div className="grid grid-cols-2 gap-3">
                        <input required placeholder="2. člen" className="input-field text-sm" value={formData.member_2} onChange={e => setFormData({...formData, member_2: e.target.value})} />
                        <input required placeholder="3. člen" className="input-field text-sm" value={formData.member_3} onChange={e => setFormData({...formData, member_3: e.target.value})} />
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={prevStep} className="btn-back"><ChevronLeft size={18} /></button>
                        <button 
                            type="button" 
                            onClick={nextStep} 
                            disabled={!formData.captain_name || !formData.member_2 || !formData.member_3}
                            className="btn-next disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                            Poslední krok <ChevronRight size={18} />
                            </button>
                      </div>
                    </motion.div>
                  )}

                  {/* KROK 3: KATEGORIE & EMAIL */}
                  {step === 3 && (
                    <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                      <div className="flex items-center gap-3 text-accent-blue mb-2 font-bold uppercase text-xs tracking-widest">
                        <Mail size={16} /> Dokončení
                      </div>
                      <select 
                        className="input-field appearance-none cursor-pointer" 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        <option className="bg-nexoria-dark">Základní školy (6.-9. třída)</option>
                        <option className="bg-nexoria-dark">Střední školy</option>
                        <option className="bg-nexoria-dark">Open (Veřejnost)</option>
                      </select>
                      <input 
                        required 
                        type="email" 
                        placeholder="E-mail na kapitána" 
                        className="input-field" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                      />
                      <div className="flex gap-3">
                        <button type="button" onClick={prevStep} className="btn-back"><ChevronLeft size={18} /></button>
                        <button disabled={loading} type="submit" className="btn-primary w-full py-4 text-lg">
                          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Odeslat přihlášku"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}