import { useState } from 'react';
import { BookOpen, Sparkles, LogOut } from 'lucide-react';
import { Note, User } from './types';
import NotesCatalog from './components/NotesCatalog';
import AuthModal from './components/AuthModal';

const DEMO_NOTES: Note[] = [
  {
    id: 'demo-1', title: 'Introduction to Data Structures',
    description: 'Basic concepts, arrays, stacks, queues and linked lists.',
    category: 'computer-science', author: 'Demo Instructor', authorId: 'demo',
    uploadDate: new Date().toISOString(), fileSize: '120 KB', fileType: 'pdf',
    downloads: 12, views: 28, rating: 4.5,
    content: 'Introduction to data structures and their basic operations.', tags: ['DSA', 'Basics']
  },
  {
    id: 'demo-2', title: 'Python Programming Basics',
    description: 'Variables, conditions, loops, functions and introductory Python.',
    category: 'computer-science', author: 'Demo Instructor', authorId: 'demo',
    uploadDate: new Date().toISOString(), fileSize: '95 KB', fileType: 'pdf',
    downloads: 18, views: 35, rating: 4.7,
    content: 'Python programming fundamentals for beginners.', tags: ['Python', 'Programming']
  }
];

export default function App() {
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('school_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('school_user');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl"><BookOpen size={20} /></div>
          <div>
            <h1 className="font-bold text-lg">EduNotes AI</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Notes & Study Workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-sm text-slate-300">Hi, {currentUser.username}</span>
              <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowAuth(true)} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold">Login / Register</button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="text-blue-600" size={20} />
          <div>
            <h2 className="text-2xl font-bold">Smart Notes Sharing Platform</h2>
            <p className="text-sm text-slate-500">35% development stage — authentication and notes catalog foundation.</p>
          </div>
        </div>
        <NotesCatalog
          notes={notes}
          onSelectNote={() => {}}
          onRefreshNotes={() => setNotes([...notes])}
          currentUser={currentUser}
          onTriggerLogin={() => setShowAuth(true)}
        />
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuthSuccess={handleAuthSuccess} />}
    </div>
  );
}
