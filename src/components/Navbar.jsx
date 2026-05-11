import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import RegistrationModal from './RegistrationModal';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userTeam, setUserTeam] = useState(null);

  // Sledujeme stav přihlášení v localStorage
  useEffect(() => {
    const checkAuth = () => {
      const savedTeam = localStorage.getItem('team_session');
      if (savedTeam) {
        setUserTeam(JSON.parse(savedTeam));
      } else {
        setUserTeam(null);
      }
    };

    checkAuth();
    // Nasloucháme změnám v úložišti (pro případ, že by se přihlásil v jiném okně)
    window.addEventListener('storage', checkAuth);
    // Vlastní event pro okamžitý update po přihlášení v rámci stejného okna
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('team_session');
    setUserTeam(null);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/'; // Návrat na homepage
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-nexoria-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 font-black text-xl tracking-tighter cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            <div className="w-8 h-8 bg-nexoria-gradient rounded-lg rotate-12 flex items-center justify-center text-[10px] text-black">
              S
            </div>
            SUDOKU <span className="text-accent-blue font-black italic">CUP</span>
          </div>

          {/* Navigace */}
          {!userTeam && (
          <div className="hidden md:flex gap-8 text-[11px] uppercase font-bold tracking-[0.2em] text-gray-500">
            <a href="#about" className="hover:text-white transition-colors">O turnaji</a>
            <a href="#rules" className="hover:text-white transition-colors">Pravidla</a>
            <a href="#community" className="hover:text-white transition-colors">Komunita</a>
            <a href="#resources" className="hover:text-white transition-colors">Přihlášky</a>
            <a href="#partners" className="hover:text-white transition-colors">Partneři</a>
            <a href="#contact" className="hover:text-white transition-colors">Kontakt</a>
          </div>
        )}

          {/* Auth sekce */}
          <div className="flex items-center gap-4">
            {userTeam ? (
              <div className="flex items-center gap-4 bg-white/5 p-1 pr-4 rounded-full border border-white/10">
                <div className="w-8 h-8 bg-accent-blue/20 rounded-full flex items-center justify-center text-accent-blue">
                  <User size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight leading-none">Tým</span>
                  <span className="text-sm font-bold text-white leading-tight">{userTeam.team_name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-xs font-bold uppercase tracking-widest px-4 py-2 hover:text-white transition-colors"
                >
                  Přihlásit se
                </button>
                <button 
                  onClick={() => setIsRegOpen(true)}
                  className="btn-primary py-2.5 px-6 text-xs"
                >
                  Registrace
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <RegistrationModal isOpen={isRegOpen} onClose={() => setIsRegOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}