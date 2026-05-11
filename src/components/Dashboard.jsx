import { useState } from 'react';
import { supabase } from '../lib/supabase'; // Ujisti se, že máš správnou cestu k souboru
import { 
  Settings, Shield, User, 
  CheckCircle2, AlertCircle, Save, 
  LayoutDashboard, Trophy, RefreshCw
} from 'lucide-react';

export default function Dashboard({ team }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview / settings
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Stavy pro formuláře
  const [teamName, setTeamName] = useState(team.team_name);
  const [newPassword, setNewPassword] = useState('');

  // --- FUNKCE: ZMĚNA JMÉNA TÝMU ---
  const handleUpdateTeamName = async (e) => {
  e.preventDefault();
  setLoading(true);

  const { error } = await supabase
    .from('registrations') // Tady MUSÍ být registrations
    .update({ team_name: teamName }) // teamName je stav z inputu
    .eq('id', team.id);

  if (error) {
    console.error("Chyba při zápisu do DB:", error);
    alert("Chyba v DB: " + error.message);
  } else {
    // Teprve když DB odpoví úspěchem, aktualizujeme lokální sezení
    const updatedSession = { ...team, team_name: teamName };
    localStorage.setItem('team_session', JSON.stringify(updatedSession));
    window.dispatchEvent(new Event('auth-change'));
    setMessage({ type: 'success', text: 'Jméno týmu uloženo v DB i na webu!' });
  }
  setLoading(false);
};

  // --- FUNKCE: ZMĚNA HESLA ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('teams')
      .update({ password: newPassword }) // V produkci by heslo mělo být hashované!
      .eq('id', team.id);

    if (error) {
      setMessage({ type: 'error', text: 'Chyba při změně hesla.' });
    } else {
      setMessage({ type: 'success', text: 'Heslo bylo úspěšně aktualizováno.' });
      setNewPassword('');
    }
    setLoading(false);
  };

  const generateKey = () => {
  // Generuje 8-místný kód (velká písmena a čísla)
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Vynechal jsem 0, O, 1, I pro lepší čitelnost
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  setNewPassword(result);
};

  return (
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* --- SIDEBAR MENU --- */}
        <aside className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            <LayoutDashboard size={20} /> Přehled
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            <Settings size={20} /> Nastavení
          </button>
        </aside>

        {/* --- HLAVNÍ OBSAH --- */}
        <div className="flex-1 space-y-8">
          
          {/* Upozornění (Success/Error) */}
          {message.text && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-bold">{message.text}</span>
            </div>
          )}

          {activeTab === 'overview' ? (
            /* --- TAB: PŘEHLED (Tvá původní karta) --- */
            <div className="glass-card p-10 border-accent-blue/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Trophy size={120} className="text-accent-blue" />
               </div>
               
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-accent-blue/20 rounded-2xl flex items-center justify-center text-accent-blue">
                        <User size={32} />
                     </div>
                     <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Tým {team.team_name}</h1>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{team.category}</p>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                     <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-purple">Sestava týmu</h3>
                        <div className="space-y-2">
                           <MemberItem name={team.captain_name} role="Kapitán" isCaptain />
                           <MemberItem name={team.member_2 || "Pozice neobsazena"} role="Člen týmu" />
                            <MemberItem name={team.member_3 || "Pozice neobsazena"} role="Člen týmu" />
                        </div>
                     </div>
                     <div className="bg-white/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-4">
                        <CheckCircle2 size={40} className="text-green-500" />
                        <h3 className="font-bold text-xl uppercase tracking-tight">Status: Potvrzeno</h3>
                        <p className="text-gray-500 text-xs">Vaše registrace do ročníku 2026 je platná. Sledujte e-mail pro další instrukce.</p>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            /* --- TAB: NASTAVENÍ (Nové funkce) --- */
            <div className="space-y-6">
              
              {/* Změna jména */}
              <div className="glass-card p-8 border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <User className="text-accent-blue" size={20} /> Profil týmu
                </h3>
                <form onSubmit={handleUpdateTeamName} className="flex gap-4">
                  <input 
                    type="text" 
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-white focus:border-accent-blue transition-outline outline-none"
                    placeholder="Nový název týmu"
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-accent-blue hover:bg-accent-blue/80 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-all"
                  >
                    <Save size={16} /> {loading ? 'Ukládám...' : 'Uložit'}
                  </button>
                </form>
              </div>

              {/* Zabezpečení */}
                {/* Zabezpečení - Generátor klíče */}
                <div className="glass-card p-8 border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                    <Shield className="text-accent-purple" size={20} /> Přístupový klíč
                    </h3>
                    <button 
                    type="button"
                    onClick={generateKey}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg font-black uppercase tracking-widest transition-all flex items-center gap-2 w-fit"
                    >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Generovat nový klíč
                    </button>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">
                        Váš aktuální / nový klíč
                    </label>
                    <input 
                        type="text" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value.toUpperCase())} // Automaticky na velká písmena
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent-purple transition-outline outline-none font-mono text-xl tracking-[0.3em]"
                        placeholder="KLÍČ-123"
                    />
                    <p className="text-[10px] text-gray-500 ml-1 italic">
                        Po vygenerování nebo úpravě klíče nezapomeňte kliknout na "Uložit klíč".
                    </p>
                    </div>
                    
                    <button 
                    type="submit"
                    disabled={loading || !newPassword}
                    className="bg-accent-purple hover:bg-accent-purple/80 shadow-lg shadow-accent-purple/20 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                    <Save size={18} /> {loading ? 'Ukládám...' : 'Uložit klíč'}
                    </button>
                </form>
                </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Pomocná komponenta pro členy týmu
function MemberItem({ name, role, isCaptain }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isCaptain ? 'bg-accent-purple' : 'bg-accent-blue'}`} />
        <span className="font-bold text-sm">{name}</span>
      </div>
      <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">{role}</span>
    </div>
  );
}