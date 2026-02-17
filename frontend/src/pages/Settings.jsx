import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Shield, Info, ToggleRight, ToggleLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const toggleDiscoverable = async () => {
    await updateProfile({ discoverableByEmail: !user.discoverableByEmail });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col max-w-lg mx-auto border-x border-white/10 shadow-2xl">
      <div className="p-6 flex items-center gap-4 glass-navbar">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Privacy & Settings</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* User Info */}
        <div className="flex items-center gap-4 p-4 glass-card border-white/5">
            <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center font-bold text-2xl">
                {user.displayName?.[0]}
            </div>
            <div>
                <p className="font-bold text-lg">{user.displayName}</p>
                <p className="text-sm text-white/40">{user.email}</p>
            </div>
        </div>

        {/* Privacy Section */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} /> Security Controls
            </h3>
            
            <div className="glass-card overflow-hidden">
                <div 
                    onClick={toggleDiscoverable}
                    className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Info size={18} className="text-white/40" />
                        <div>
                            <p className="text-sm font-medium">Discoverable by Email</p>
                            <p className="text-[10px] text-white/30">Allow others to find you for new chats</p>
                        </div>
                    </div>
                    {user.discoverableByEmail ? <ToggleRight className="text-[#41D1FF]" /> : <ToggleLeft className="text-white/20" />}
                </div>

                <div className="p-4 flex items-center justify-between border-t border-white/5 opacity-50">
                    <div className="flex items-center gap-3">
                        <User size={18} className="text-white/40" />
                        <p className="text-sm font-medium">Manage Blocked Users</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center pt-10">
            <p className="text-[10px] text-white/20 font-mono">SEVO v1.0.0-PROD</p>
            <p className="text-[10px] text-white/10 mt-1">Experimental build for secure communication</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
