import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, UserIcon, ShieldIcon, InfoIcon, ToggleRightIcon, ToggleLeftIcon } from '../components/Icons';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const toggleDiscoverable = async () => {
    await updateProfile({ discoverableByEmail: !user.discoverableByEmail });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-base)] text-white relative">
      <div className="absolute top-0 right-0 w-[80%] h-[30%] bg-[var(--color-secondary)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="pt-8 pb-4 px-6 flex items-center justify-center relative sticky top-0 z-20 border-b border-white/5 bg-[var(--color-bg-base)]/80 backdrop-blur-2xl">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-2.5 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white/60 hover:text-white">
          <ArrowLeftIcon size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-wide">Privacy & Settings</h1>
      </div>

      <div className="p-4 sm:p-6 space-y-8 flex-1 overflow-y-auto relative z-10 max-w-screen-sm mx-auto w-full">
        {/* User Info */}
        <div className="flex items-center gap-5 p-5 glass-card bg-[var(--color-surface)]/50 border border-white/5 shadow-lg group">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-[0_0_20px_rgba(65,209,255,0.3)] transform group-hover:scale-105 transition-transform">
            {user.displayName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-xl tracking-tight text-white mb-0.5">{user.displayName}</p>
            <p className="text-xs text-[var(--color-primary)] font-medium tracking-wide">{user.email}</p>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest flex items-center gap-2 px-1">
            <ShieldIcon size={16} /> Security Controls
          </h3>

          <div className="glass-card overflow-hidden bg-[var(--color-surface)]/30 border border-white/5 shadow-md">
            <div
              onClick={toggleDiscoverable}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all active:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <InfoIcon size={20} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white mb-0.5">Discoverable by Email</p>
                  <p className="text-[11px] text-white/40 font-medium">Allow others to find you for new chats</p>
                </div>
              </div>
              {user.discoverableByEmail ? (
                <ToggleRightIcon size={32} className="text-[var(--color-primary)] drop-shadow-[0_0_8px_rgba(65,209,255,0.5)] transition-all" />
              ) : (
                <ToggleLeftIcon size={32} className="text-white/20 transition-all" />
              )}
            </div>

            <div className="p-4 sm:p-5 flex items-center justify-between border-t border-white/5 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <UserIcon size={20} />
                </div>
                <p className="text-[15px] font-bold text-white/70">Manage Blocked Users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-12 pb-8">
          <div className="mx-auto w-12 h-1 bg-white/10 rounded-full mb-6"></div>
          <p className="text-[10px] text-[var(--color-primary)] font-black tracking-widest mb-1.5 uppercase">SEVO EXPERIMENTAL</p>
          <p className="text-[11px] text-white/30 font-medium">v1.0.0-PROD • Zero Logs</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
