import { useState } from "react";
import {
  BookOpen,
  Sparkles,
  LogOut,
  Search,
  Upload,
  Users,
  FileText,
  GraduationCap,
  ArrowRight,
  BookMarked,
  ShieldCheck,
} from "lucide-react";

import { Note, User } from "./types";
import NotesCatalog from "./components/NotesCatalog";
import AuthModal from "./components/AuthModal";

const DEMO_NOTES: Note[] = [
  {
    id: "demo-1",
    title: "Introduction to Data Structures",
    description:
      "Basic concepts, arrays, stacks, queues and linked lists.",
    category: "computer-science",
    author: "Demo Instructor",
    authorId: "demo",
    uploadDate: new Date().toISOString(),
    fileSize: "120 KB",
    fileType: "pdf",
    downloads: 12,
    views: 28,
    rating: 4.5,
    content:
      "Introduction to data structures and their basic operations.",
    tags: ["DSA", "Basics"],
  },
  {
    id: "demo-2",
    title: "Python Programming Basics",
    description:
      "Variables, conditions, loops, functions and introductory Python.",
    category: "computer-science",
    author: "Demo Instructor",
    authorId: "demo",
    uploadDate: new Date().toISOString(),
    fileSize: "95 KB",
    fileType: "pdf",
    downloads: 18,
    views: 35,
    rating: 4.7,
    content:
      "Python programming fundamentals for beginners.",
    tags: ["Python", "Programming"],
  },
];

export default function App() {
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [search, setSearch] = useState("");

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("school_user", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("school_user");
  };

  const filteredNotes = notes.filter((note) => {
    const value = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(value) ||
      note.description.toLowerCase().includes(value) ||
      note.category.toLowerCase().includes(value)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
              <BookOpen size={25} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Note<span className="text-indigo-600">Share</span>
              </h1>
              <p className="text-xs text-slate-500">
                Learn • Share • Grow
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#home" className="font-semibold text-indigo-600">
              Home
            </a>
            <a href="#notes" className="text-slate-600 hover:text-indigo-600">
              Browse
            </a>
            <a href="#categories" className="text-slate-600 hover:text-indigo-600">
              Categories
            </a>
            <a href="#about" className="text-slate-600 hover:text-indigo-600">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="hidden text-sm font-medium text-slate-600 sm:block">
                  Hi, {currentUser.username}
                </span>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
              >
                Login / Sign Up
              </button>
            )}
          </div>

        </div>
      </header>


      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
              <Sparkles size={16} />
              Knowledge for a brighter tomorrow
            </div>

            <h2 className="max-w-2xl text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
              Share Notes.
              <br />
              Build a{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Better You.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Upload, discover and learn from high-quality study notes,
              question papers, textbooks and useful academic resources.
            </p>

           

            {/* TAGS */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["Python", "Data Structures", "DBMS", "Java", "Web Development"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="subject-chip"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>


          {/* BOOK ILLUSTRATION */}
          <div className="relative">
            <div className="education-card relative overflow-hidden p-8">

              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-100/60 blur-2xl" />

              <div className="relative flex flex-col items-center">

                <GraduationCap
                  size={70}
                  className="mb-5 text-indigo-600"
                />

                <div className="w-full max-w-md space-y-3">

                  <button
  onClick={() =>
    document.getElementById("notes")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-5 text-center text-xl font-extrabold text-white shadow-lg transition hover:-translate-y-1"
>
  LEARN
</button>

<button
  onClick={() => setShowAuth(true)}
  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 p-5 text-center text-xl font-extrabold text-white shadow-lg transition hover:-translate-y-1"
>
  SHARE
</button>

<button
  onClick={() =>
    document.getElementById("categories")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-5 text-center text-xl font-extrabold text-white shadow-lg transition hover:-translate-y-1"
>
  GROW
</button>

<button
  onClick={() =>
    document.getElementById("about")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-center text-xl font-extrabold text-white shadow-lg transition hover:-translate-y-1"
>
  SUCCEED
</button>  

                </div>

                <p className="mt-6 text-center text-lg font-semibold italic text-indigo-700">
                  “Good notes create better futures.”
                </p>

              </div>
            </div>
          </div>

        </div>
      </section>


      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 pb-12">

        <div className="grid gap-5 md:grid-cols-4">

          <div className="education-card p-6">
            <div className="icon-blue mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <Upload size={23} />
            </div>
            <h3 className="font-bold text-slate-900">Upload Notes</h3>
            <p className="mt-1 text-sm text-slate-500">
              Share your useful study resources.
            </p>
          </div>

          <div className="education-card p-6">
            <div className="icon-purple mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <Search size={23} />
            </div>
            <h3 className="font-bold text-slate-900">Explore</h3>
            <p className="mt-1 text-sm text-slate-500">
              Find notes whenever you need them.
            </p>
          </div>

          <div className="education-card p-6">
            <div className="icon-pink mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <Users size={23} />
            </div>
            <h3 className="font-bold text-slate-900">Learn Together</h3>
            <p className="mt-1 text-sm text-slate-500">
              Build a collaborative student community.
            </p>
          </div>

          <div className="education-card p-6">
            <div className="icon-green mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <ShieldCheck size={23} />
            </div>
            <h3 className="font-bold text-slate-900">Quality Content</h3>
            <p className="mt-1 text-sm text-slate-500">
              Access organized academic resources.
            </p>
          </div>

        </div>
      </section>


      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="font-semibold text-indigo-600">
              Explore knowledge
            </p>

            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
              Browse by Subject
            </h2>
          </div>

          <button className="hidden items-center gap-2 font-semibold text-indigo-600 sm:flex">
            View All <ArrowRight size={17} />
          </button>
        </div>


        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">

          {[
            ["Computer Science", "120+ notes", "icon-blue", "💻"],
            ["Mathematics", "95+ notes", "icon-purple", "📐"],
            ["Programming", "80+ notes", "icon-pink", "💻"],
            ["Database", "60+ notes", "icon-green", "🗄️"],
            ["Science", "70+ notes", "icon-blue", "🔬"],
            ["Others", "50+ notes", "icon-purple", "📚"],
          ].map(([name, count, color, icon]) => (

            <button
              key={name}
              onClick={() => setSearch(name)}
              className="education-card p-5 text-center transition hover:-translate-y-1"
            >
              <div
                className={`${color} mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl`}
              >
                {icon}
              </div>

              <h3 className="font-bold text-slate-900">
                {name}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {count}
              </p>
            </button>

          ))}

        </div>
      </section>


      {/* NOTES */}
      <section id="notes" className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-7 flex items-end justify-between">

          <div>
            <p className="font-semibold text-indigo-600">
              Study resources
            </p>

            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
              Recent Notes
            </h2>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <BookMarked size={18} />
            {filteredNotes.length} resources available
          </div>

        </div>

        <NotesCatalog
          notes={filteredNotes}
          onSelectNote={() => {}}
          onRefreshNotes={() => setNotes([...notes])}
          currentUser={currentUser}
          onTriggerLogin={() => setShowAuth(true)}
        />

      </section>


      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">

          <div className="grid gap-8 md:grid-cols-4">

            <div className="flex items-center gap-4">
              <FileText size={38} />
              <div>
                <p className="text-3xl font-extrabold">500+</p>
                <p className="text-sm text-indigo-100">Notes Shared</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Users size={38} />
              <div>
                <p className="text-3xl font-extrabold">1,000+</p>
                <p className="text-sm text-indigo-100">Students</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <BookOpen size={38} />
              <div>
                <p className="text-3xl font-extrabold">50+</p>
                <p className="text-sm text-indigo-100">Subjects</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Sparkles size={38} />
              <div>
                <p className="text-3xl font-extrabold">100%</p>
                <p className="text-sm text-indigo-100">Free Learning</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-12">

        <div className="education-card flex flex-col items-center justify-between gap-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 text-center md:flex-row md:text-left">

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Be Part of the Learning Community
            </h2>

            <p className="mt-2 text-slate-600">
              Share your knowledge and help other students learn.
            </p>
          </div>

          <button
            onClick={() => setShowAuth(true)}
            className="education-button flex items-center gap-2"
          >
            Get Started
            <ArrowRight size={18} />
          </button>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-indigo-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-500 md:flex-row">

          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-600" />
            <span>
              © 2026 NoteShare. Learn • Share • Grow.
            </span>
          </div>

          <span>
            Smart Notes Sharing Platform
          </span>

        </div>
      </footer>


      {/* AUTH MODAL */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

    </div>
  );
}
