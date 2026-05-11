import { useState, useEffect } from 'react';
import { 
  Trophy, Users, Mail, FileText, 
  Calendar, MapPin, BookOpen, 
  CheckCircle2, MessageSquare, Send 
} from 'lucide-react';

import Navbar from '../components/Navbar';
import RegistrationModal from '../components/RegistrationModal';
import Dashboard from '../components/Dashboard';
import { supabase } from '../lib/supabase'; // Ujisti se, že máš správnou cestu k souboru

export default function SudokuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userTeam, setUserTeam] = useState(null);

  // Kontrola přihlášení
  useEffect(() => {
  const checkAuth = async () => {
    const savedTeam = localStorage.getItem('team_session');
    
    if (savedTeam) {
      const parsedTeam = JSON.parse(savedTeam);
      
      // EXTRA BEZPEČNOST: Ověříme v Supabase, že ten tým stále existuje a data sedí
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', parsedTeam.id)
        .single();

      if (error || !data) {
        // Pokud tým v DB neexistuje, smažeme falešné sezení a vyhodíme ho
        localStorage.removeItem('team_session');
        setUserTeam(null);
      } else {
        // Pokud je vše v pořádku, uložíme čerstvá data z DB (kdyby se mezitím změnilo jméno)
        setUserTeam(data);
      }
    } else {
      setUserTeam(null);
    }
  };

  checkAuth();
  
  // Posloucháme změny (přihlášení/odhlášení)
  window.addEventListener('auth-change', checkAuth);
  
  // Kontrola při návratu na kartu (prevence proti smazání session v jiném okně)
  window.addEventListener('focus', checkAuth);

  return () => {
    window.removeEventListener('auth-change', checkAuth);
    window.removeEventListener('focus', checkAuth);
  };
}, []);

  return (
    <div className="min-h-screen bg-nexoria-dark text-white selection:bg-accent-purple/30">
      
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Navbar si hlídá stav sám skrze useEffect */}
      <Navbar />

      <main>
        {userTeam ? (
          <Dashboard team={userTeam} />
        ) : (
          <>
            {/* --- HERO SEKCE --- */}
            <header id="about" className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Calendar size={14} /> Ročník 2026
                </div>
                <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase">
                  Logická <br /> <span className="text-gradient">revoluce</span> <br /> v lavicích.
                </h1>
                <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                  Největší sudoku turnaj pro studenty. Zapomeň na kalkulačky, tady rozhoduje jen tvůj postřeh a logický úsudek.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button onClick={() => setIsModalOpen(true)} className="btn-primary text-sm px-10 py-4 uppercase tracking-widest font-bold">
                    Registrace týmu
                  </button>
                  <a href="#rules" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-sm uppercase tracking-widest">
                    Více o soutěži
                  </a>
                </div>
              </div>
              
              <div className="relative flex justify-center">
                <div className="absolute inset-0 bg-accent-blue/20 blur-[120px] rounded-full" />
                <div className="relative z-10 w-full aspect-square glass-card flex items-center justify-center border-white/10 overflow-hidden">
                   <span className="text-[200px] font-black text-white/5 select-none">S</span>
                   <Trophy className="absolute text-accent-purple animate-bounce" size={80} />
                </div>
              </div>
            </header>

            {/* --- PRAVIDLA A STRUKTURA --- */}
            <section id="rules" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold uppercase tracking-tighter">Jak soutěž <span className="text-gradient">probíhá?</span></h2>
                <p className="text-gray-500">Od školního kola až po celostátní finále.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <InfoCard 
                  icon={<MapPin />} 
                  title="Struktura" 
                  items={[
                    "Školní kola: Kvalifikace na školách",
                    "Oblastní kola: Souboj v rámci okresů",
                    "Grandfinále: 32 nejlepších z celé ČR"
                  ]}
                />
                <InfoCard 
                  icon={<CheckCircle2 />} 
                  title="Pravidla" 
                  items={[
                    "Týmy po 3 členech",
                    "Zákaz elektroniky a nápověd",
                    "Bodování: Rychlost + Přesnost",
                    "Limit 45 minut na kolo"
                  ]}
                />
                <InfoCard 
                  icon={<BookOpen />} 
                  title="Kategorie" 
                  items={[
                    "ZŠ (6. - 9. třída)",
                    "SŠ (všechny typy středních škol)",
                    "Open (pro učitele a veřejnost)"
                  ]}
                />
              </div>
            </section>

            {/* --- KOMUNITA --- */}
            <section id="community" className="py-24 bg-white/[0.02] border-y border-white/5">
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6 tracking-tighter uppercase">Jsme v tom <span className="text-accent-blue">spolu.</span></h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Neřeš Sudoku jen v lavici. Přidej se k nám na Discordu, kde sdílíme tipy na rychlejší řešení, tréninkové sady a výsledky z minulých ročníků.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="https://discord.gg/nexoriahub" target="_blank" rel="noopener noreferrer">
                        <SocialButton icon={<MessageSquare />} label="Discord Server" color="bg-[#5865F2]" />
                    </a>
                    
                    <a href="https://instagram.com/nexoriahub" target="_blank" rel="noopener noreferrer">
                        <SocialButton icon={<MessageSquare />} label="Instagram" color="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" />
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="glass-card h-40 flex flex-col items-center justify-center text-center p-6">
                      <MessageSquare className="text-accent-purple mb-2" />
                      <span className="text-xl font-bold">1.2k+</span>
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Zpráv denně</span>
                   </div>
                   <div className="glass-card h-40 flex flex-col items-center justify-center text-center p-6 mt-8">
                      <Users className="text-accent-blue mb-2" />
                      <span className="text-xl font-bold">450</span>
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Aktivních hráčů</span>
                   </div>
                </div>
              </div>
            </section>

            {/* --- ZDROJE --- */}
            <section id="resources" className="py-32 px-6 max-w-5xl mx-auto text-center space-y-12">
              <h2 className="text-4xl font-bold uppercase tracking-tighter italic">Materiály a <span className="text-gradient">přihlášky</span></h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card p-10 space-y-6 flex flex-col items-center border-accent-blue/20 bg-accent-blue/5">
                  <FileText size={40} className="text-accent-blue" />
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Přihláška týmu</h3>
                  <p className="text-gray-400 text-sm">Oficiální registrační formulář pro kapitány týmů do ročníku 2026.</p>
                  <button onClick={() => setIsModalOpen(true)} className="bg-white/10 hover:bg-white/20 w-full py-4 rounded-2xl font-bold transition-all border border-white/5 uppercase text-[10px] tracking-widest text-center">
                    Otevřít formulář
                  </button>
                </div>
                <div className="glass-card p-10 space-y-6 flex flex-col items-center border-accent-purple/20 bg-accent-purple/5">
                    <Send size={40} className="text-accent-purple" />
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Pro učitele</h3>
                    <p className="text-gray-400 text-sm">Metodika pro uspořádání školního kola a vzorová zadání ke stažení.</p>
                    
                    {/* Úprava tlačítka na odkaz ke stažení */}
                    <a 
                        href="/downloads/sudoku_balicek_2026.zip" 
                        download 
                        className="bg-white/10 hover:bg-white/20 w-full py-4 rounded-2xl font-bold transition-all border border-white/5 uppercase text-[10px] tracking-widest text-center"
                    >
                        Stáhnout balíček (.ZIP)
                    </a>
                </div>
              </div>
            </section>

            {/* --- PARTNEŘI --- */}
            <section id="partners" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold uppercase tracking-tighter">
                  Naši <span className="text-gradient">Partneři</span>
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Děkujeme všem organizacím a firmám, které nám pomáhají posouvat logické myšlení u studentů.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <PartnerCard name="Hlavní Partner" sub="Podpora ročníku 2026" />
                <PartnerCard name="Technologický Partner" sub="Cloudové řešení" />
                <PartnerCard name="Mediální Partner" sub="Propagace akce" />
                <PartnerCard name="Vzdělávací Partner" sub="Metodika úloh" />
              </div>

              <div className="flex flex-wrap justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="px-8 py-4 bg-white/5 rounded-xl border border-white/5 font-bold text-sm tracking-widest uppercase">Škola Praha</div>
                <div className="px-8 py-4 bg-white/5 rounded-xl border border-white/5 font-bold text-sm tracking-widest uppercase">Město Turnov</div>
                <div className="px-8 py-4 bg-white/5 rounded-xl border border-white/5 font-bold text-sm tracking-widest uppercase">EduGroup</div>
              </div>
            </section>

            {/* --- FOOTER --- */}
            <footer id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
              <div className="grid md:grid-cols-4 gap-12">
                <div className="col-span-2 space-y-6">
                  <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
                    <div className="w-8 h-8 bg-nexoria-gradient rounded-lg rotate-12 flex items-center justify-center text-[10px] text-black">S</div>
                    NEXORIA <span className="text-accent-blue uppercase font-black italic">Sudoku</span>
                  </div>
                  <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
                    Máš dotaz k pravidlům, termínům nebo registraci? Náš organizační tým je tu pro tebe každý pracovní den.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-accent-blue">Hlavní kontakt</h4>
                  <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                    <Mail size={18} /> 
                    <a href="mailto:info@nexoria.cz" className="text-sm">info@nexoria.cz</a>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-accent-purple">Organizátor</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Nexoria z.s.<br />
                    Studentů 12, Praha<br />
                    IČO: 12345678
                  </p>
                </div>
              </div>
              <div className="mt-20 pt-8 border-t border-white/5 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                © 2026 Nexoria Sudoku Cup • Všechna práva vyhrazena
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

// --- POMOCNÉ KOMPONENTY ---

function InfoCard({ icon, title, items }) {
  return (
    <div className="glass-card p-8 space-y-6 hover:border-white/20 transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-500 flex gap-3 leading-relaxed">
            <span className="text-accent-purple font-bold">/</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PartnerCard({ name, sub }) {
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center text-center group hover:border-accent-blue/30 transition-all duration-300">
      <div className="w-16 h-16 bg-white/5 rounded-full mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
        <div className="w-8 h-8 bg-nexoria-gradient rounded-sm rotate-45 opacity-50" />
      </div>
      <h4 className="text-lg font-bold tracking-tight">{name}</h4>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">{sub}</p>
    </div>
  );
}

function SocialButton({ icon, label, color }) {
  return (
    <button className={`${color} px-8 py-4 rounded-2xl flex items-center gap-3 font-bold hover:opacity-90 transition-all shadow-xl text-sm uppercase tracking-widest`}>
      {icon} {label}
    </button>
  );
}