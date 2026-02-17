import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 w-full">
      <div className="max-w-sm w-full space-y-12 text-center animate-in fade-in zoom-in duration-500">
        
        {/* Logo Section */}
        <div className="space-y-4">
            <div className="w-24 h-24 primary-gradient rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-12 transition-transform hover:rotate-0 cursor-default">
                <Mic size={48} className="text-white -rotate-12 transition-transform" />
            </div>
            <div>
                <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">Sevo</h1>
                <p className="text-lg text-white/40 font-medium">Private, Ephemeral, Voice.</p>
            </div>
        </div>

        {/* Auth Section */}
        <div className="glass-card p-8 space-y-6">
            <p className="text-sm text-white/60">Unlock your secure workspace</p>
            
            <div className="flex justify-center">
                <GoogleLogin 
                    onSuccess={handleSuccess} 
                    onError={() => console.log('Login Failed')}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                />
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-widest">
                    Zero Logs • No Tracking • Pure Privacy
                </p>
            </div>
        </div>

        <p className="text-xs text-white/20">
            By continuing, you agree to Sevo's Mission of Privacy.
        </p>
      </div>
    </div>
  );
};

export default Login;
