import { useState, FormEvent } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, X, Plus, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const users = JSON.parse(
      localStorage.getItem('notes_users') || '[]'
    );

    if (isLogin) {
      const user = users.find(
        (u: User & { password: string }) =>
          u.email === email && u.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password.');
      }

      const { password: _password, ...safeUser } = user;

      onAuthSuccess(safeUser as User);
      onClose();
    } else {
      const existingUser = users.find(
        (u: User & { password: string }) =>
          u.email === email
      );

      if (existingUser) {
        throw new Error('Account already exists. Please sign in.');
      }

      const newUser = {
        username,
        email,
        password,
        role,
        bio,
      };

      users.push(newUser);

      localStorage.setItem(
        'notes_users',
        JSON.stringify(users)
      );

      const { password: _password, ...safeUser } = newUser;

      onAuthSuccess(safeUser as User);
      onClose();
    }
  } catch (err: any) {
    setError(
      err.message || 'Authentication failed.'
    );
  } finally {
    setLoading(false);
  }
};
     
  } finally {
    setLoading(false);
  }
};
 
return (

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div id="auth-modal-card" className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            id="auth-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Sparkles size={20} className="fill-blue-400/20" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">AI NoteHub</span>
          </div>
          <h3 className="text-xl font-display font-semibold">
            {isLogin ? 'Welcome Back' : 'Create Student Account'}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {isLogin 
              ? 'Access your saved documents, flashcards, and AI tutor.' 
              : 'Sign up to share study notes and trigger automatic summaries.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div id="auth-err-alert" className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-lg flex items-start gap-2.5 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Display Username</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><UserIcon size={16} /></span>
                <input
                  id="auth-username-input"
                  type="text"
                  required
                  placeholder="e.g. janesmith"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400"><Mail size={16} /></span>
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Security Password</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400"><Lock size={16} /></span>
              <input
                id="auth-password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">University Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="role-student-btn"
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      role === 'student'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    University Student
                  </button>
                  <button
                    id="role-instructor-btn"
                    type="button"
                    onClick={() => setRole('instructor')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      role === 'instructor'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    College Lecturer
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Short Bio (Optional)</label>
                <textarea
                  id="auth-bio-input"
                  placeholder="Tell students about your topics of interest..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800 resize-none h-16"
                />
              </div>
            </>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg text-sm transition-all focus:outline-none flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Account' : 'Register Account'}
          </button>

          <div className="text-center mt-3">
            <button
              id="toggle-auth-mode-btn"
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? "New to the platform? Create an account" : "Already registered? Login here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
