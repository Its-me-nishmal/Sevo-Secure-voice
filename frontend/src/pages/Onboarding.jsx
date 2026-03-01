import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheckIcon } from '../components/Icons';

const Onboarding = () => {
  const [name, setName] = useState('');
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await updateProfile({ displayName: name });
      navigate('/');
    } catch (err) {
      alert('Failed to update name');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-base)] flex items-center justify-center p-6 w-full relative overflow-hidden supports-[height:100cqh]:min-h-[100cqh] supports-[height:100svh]:min-h-[100svh]">
      {/* Background FX */}
      <div className="absolute top-[-10%] right-[-20%] w-[60%] h-[50%] bg-[var(--color-primary)]/10 blur-[130px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-[0%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-secondary)]/10 blur-[150px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-sm w-full glass-card p-8 space-y-8 text-center animate-in slide-in-from-bottom-4 duration-500 bg-[var(--color-surface)]/50 border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-[0_0_30px_rgba(65,209,255,0.3)] rounded-3xl mx-auto flex items-center justify-center text-white">
          <UserCheckIcon size={40} />
        </div>

        <div>
          <h2 className="text-3xl font-black mb-2 text-white tracking-tight">Almost there!</h2>
          <p className="text-white/50 text-[15px] font-medium">How should people identify you?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Your display name"
            required
            className="w-full bg-[var(--color-bg-base)]/50 border border-white/10 rounded-2xl py-4 px-4 text-center text-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-semibold text-white placeholder-white/20 shadow-inner"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="w-full btn-primary py-4 text-lg">
            Finish Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
