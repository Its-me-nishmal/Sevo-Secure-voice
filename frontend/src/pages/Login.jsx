import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogoIcon } from '../components/Icons';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const data = await login(response.credential);
      if (data.isNewUser) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-base)] flex items-center justify-center p-6 w-full relative overflow-hidden supports-[height:100cqh]:min-h-[100cqh] supports-[height:100svh]:min-h-[100svh]">
      {/* Background FX */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] bg-[var(--color-primary)]/10 blur-[130px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-secondary)]/10 blur-[150px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-sm w-full space-y-12 text-center relative z-10">

        {/* Logo Section */}
        <div className="space-y-6">
          <div className="w-28 h-28 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[2.5rem] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(65,209,255,0.3)] transform transition-transform hover:scale-105 duration-500 cursor-default">
            <LogoIcon size={56} className="text-white drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-3">Sevo</h1>
            <p className="text-[17px] text-white/50 font-medium tracking-wide">Private. Ephemeral. Voice.</p>
          </div>
        </div>

        {/* Auth Section */}
        <div className="glass-card p-8 space-y-8 bg-[var(--color-surface)]/40 border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <p className="text-sm text-white/70 font-medium">Unlock your secure workspace</p>

          <div className="flex justify-center transition-transform hover:scale-[1.02] active:scale-95 duration-200">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log('Login Failed')}
              theme="filled_black"
              shape="pill"
              size="large"
            />
          </div>

          <div className="pt-6 border-t border-white/5 space-y-2">
            <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-[0.2em] font-bold">
              Zero Logs • No Tracking • Pure Privacy
            </p>
          </div>
        </div>

        <p className="text-xs text-white/30 font-medium px-4">
          By continuing, you agree to Sevo's Mission of Privacy.
        </p>
      </div>
    </div>
  );
};

export default Login;
