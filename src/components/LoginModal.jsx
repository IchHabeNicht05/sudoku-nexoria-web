import { useState } from 'react';
import { X, LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function LoginModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  // 1. Změň tabulku na 'teams' (pokud tam máš finální data s member_2 atd.)
  // 2. Ujisti se, že sloupec se jmenuje 'access_code' (nebo 'password')
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('email', email.trim())
    .eq('access_code', accessCode.toUpperCase().trim())
    .single();

  setLoading(false);

  if (error || !data) {
    alert("Nesprávný e-mail nebo přístupový kód.");
    console.error("Chyba přihlášení:", error);
  } else {
    // ULOŽENÍ: Data musí obsahovat 'id', aby je SudokuPage.jsx mohl ověřit
    localStorage.setItem('team_session', JSON.stringify(data));
    
    // SPUŠTĚNÍ PŘEPNUTÍ: Toto je ten signál pro SudokuPage, aby zobrazil Dashboard
    window.dispatchEvent(new Event('auth-change'));
    
    onClose();
  }
};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-black/80 backdrop-blur-lg" 
        />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          className="relative w-full max-w-md glass-card border-white/10 p-8 shadow-2xl"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent-purple/20 border border-accent-purple/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-accent-purple" size={32} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">
              Sekce <span className="text-gradient">Kapitána</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Správa týmu a přístup k zadáním</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required 
                type="email" 
                placeholder="E-mail kapitána" 
                className="input-field pl-12" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required 
                type="password" 
                placeholder="Přístupový kód" 
                className="input-field pl-12" 
                value={accessCode}
                onChange={e => setAccessCode(e.target.value)}
              />
            </div>

            <button 
              disabled={loading} 
              className="btn-primary w-full py-4 text-lg mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Přihlásit se"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-xs text-gray-500 hover:text-accent-blue transition-colors uppercase tracking-widest font-bold">
              Zapomenuté heslo?
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}