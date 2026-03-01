import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import AppLayout from './components/AppLayout';

const PrivateRoute = ({ children, hideNav }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen bg-[#0d1117] flex items-center justify-center text-white/50 animate-pulse">
      Loading Sevo...
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  // Force onboarding if display name is missing
  if (!user.displayName && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  return <AppLayout hideNav={hideNav}>{children}</AppLayout>;
};

function App() {
  const GOOGLE_CLIENT_ID = "860214508177-89ulbq3phnr1vvq77r470nec69cv02tb.apps.googleusercontent.com"; // Replace with your actual client ID

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />

            <Route path="/chat/:id" element={
              <PrivateRoute hideNav>
                <Chat />
              </PrivateRoute>
            } />

            <Route path="/onboarding" element={
              <PrivateRoute hideNav>
                <Onboarding />
              </PrivateRoute>
            } />

            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
