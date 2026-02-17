import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 w-full">
      <div className="max-w-sm w-full glass-card p-8 space-y-8 text-center animate-in slide-in-from-bottom-4 duration-500">
        <div className="w-16 h-16 bg-[#41D1FF]/10 rounded-2xl mx-auto flex items-center justify-center text-[#41D1FF]">
            <UserCheck size={32} />
        </div>
        
        <div>
            <h2 className="text-2xl font-bold mb-2">Almost there!</h2>
            <p className="text-white/50 text-sm">How should people identify you?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Your display name"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-center text-lg focus:outline-none focus:border-[#41D1FF] transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="w-full btn-primary py-4">
            Finish Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
