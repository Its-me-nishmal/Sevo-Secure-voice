import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Settings, MessageSquarePlus } from 'lucide-react';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 glass-navbar border-t border-white/10 flex items-center justify-around z-50 px-6">
            <button 
                onClick={() => navigate('/')} 
                className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-[#41D1FF]' : 'text-white/40 hover:text-white/60'}`}
            >
                <Home size={22} />
                <span className="text-[10px] font-medium">Home</span>
            </button>
            <button 
                className={`flex flex-col items-center gap-1 text-white/40 hover:text-white/60 transition-all`}
            >
                <Search size={22} />
                <span className="text-[10px] font-medium">Search</span>
            </button>
            <button 
                className="w-12 h-12 primary-gradient rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-[#BD34FE]/30 active:scale-95 transition-transform"
            >
                <MessageSquarePlus size={24} className="text-white" />
            </button>
            <div className="w-1 h-5" /> 
            <button 
                onClick={() => navigate('/settings')} 
                className={`flex flex-col items-center gap-1 transition-all ${isActive('/settings') ? 'text-[#41D1FF]' : 'text-white/40 hover:text-white/60'}`}
            >
                <Settings size={22} />
                <span className="text-[10px] font-medium">Settings</span>
            </button>
        </div>
    );
};

export default BottomNav;
