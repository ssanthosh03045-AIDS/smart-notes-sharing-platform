import { useState, useEffect, useRef, DragEvent, ChangeEvent, FormEvent } from 'react';
import { Note, CategoryType, User } from '../types';
import { 
  Search, Cpu, Calculator, FlaskConical, Compass, Feather, 
  Briefcase, Leaf, Sparkles, UploadCloud, Star, Download, Eye, 
  FileText, Plus, X, Tag, BookOpen, AlertCircle, Heart
} from 'lucide-react';

interface NotesCatalogProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onRefreshNotes: () => void;
  currentUser: User | null;
  onTriggerLogin: () => void;
}

const CATEGORIES: { slug: CategoryType; name: string; icon: any; color: string }[] = [
  { slug: 'computer-science', name: 'Comp Sci', icon: Cpu, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { slug: 'mathematics', name: 'Mathematics', icon: Calculator, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { slug: 'physics', name: 'Physics', icon: Sparkles, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { slug: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { slug: 'biology', name: 'Biology', icon: Leaf, color: 'bg-teal-50 text-teal-600 border-teal-100' },
  { slug: 'history', name: 'History', icon: Compass, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { slug: 'literature', name: 'Literature', icon: Feather, color: 'bg-sky-50 text-sky-600 border-sky-100' },
  { slug: 'business', name: 'Business', icon: Briefcase, color: 'bg-violet-50 text-violet-600 border-violet-100' },
];

export default function NotesCatalog({ notes, onSelectNote, onRefreshNotes, currentUser, onTriggerLogin }: NotesCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all' | 'saved' | 'my'>('all');
  useEffect(() => {
  const handleSavedNotes = () => {
    setSearchTerm("");
    setSelectedCategory("saved");

    setTimeout(() => {
      document.getElementById("notes")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  window.addEventListener("showSavedNotes", handleSavedNotes);

  return () => {
    window.removeEventListener("showSavedNotes", handleSavedNotes);
  };
}, []);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<string[]>(() => {
  try {
    return JSON.parse(localStorage.getItem('bookmarked_notes') || '[]');
  } catch {
    return [];
  }
});
  const toggleBookmark = (noteId: string) => {
  setBookmarkedNotes(prev => {
    const updated = prev.includes(noteId)
      ? prev.filter(id => id !== noteId)
      : [...prev, noteId];

    localStorage.setItem(
      'bookmarked_notes',
      JSON.stringify(updated)
    );

    return updated;
  });
};
  const [viewNote, setViewNote] = useState<Note | null>(null);
  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState<CategoryType>('computer-science');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadFileType, setUploadFileType] = useState<'pdf' | 'doc' | 'txt' | 'ppt'>('pdf');
  const [tagInput, setTagInput] = useState('');
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx'].includes(extension || '')) {
        setUploadFileType((extension === 'txt' ? 'txt' : extension === 'ppt' || extension === 'pptx' ? 'ppt' : 'pdf') as any);
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
        
        // Read file if it is plain text for convenience
        if (extension === 'txt') {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (evt.target?.result) {
              setUploadContent(evt.target.result as string);
            }
          };
          reader.readAsText(file);
        } else {
          setUploadContent(`Draft content uploaded from File: ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB. Add comprehensive textbook definitions, formulas, rules and equations here so the AI tutor can answer specific questions correctly.`);
        }
      } else {
        setUploadError("Format not supported. Plase drop PDF, DOC, TXT, or PPT drafts.");
      }
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
      if (extension === 'txt') {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target?.result) {
            setUploadContent(evt.target.result as string);
          }
        };
        reader.readAsText(file);
      } else {
        setUploadContent(`Notes drafted from uploaded file: ${file.name}. (Replace or append with your lecture transcripts or textbook copy to query the AI assistant thoroughly).`);
      }
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !uploadTags.includes(trimmed)) {
      setUploadTags([...uploadTags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setUploadTags(uploadTags.filter(item => item !== t));
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploadError('');
    
    if (!currentUser) {
      setUploadError("Guest mode is read-only. Please click 'Sign In' to share notes.");
      return;
    }

    if (!uploadTitle.trim() || !uploadContent.trim()) {
      setUploadError("Please provide both a Title and Note context text!");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          description: uploadDesc || "No description provided.",
          category: uploadCategory,
          author: currentUser.username,
          authorId: currentUser.id,
          fileType: uploadFileType,
          content: uploadContent,
          tags: uploadTags.length > 0 ? uploadTags : [uploadCategory]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Uploading note draft failed.");
      }

      onRefreshNotes();
      setShowUploadModal(false);
      resetUploadForm();
    } catch (err: any) {
      setUploadError(err.message || "An unexpected network error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadTitle('');
    setUploadDesc('');
    setUploadCategory('computer-science');
    setUploadContent('');
    setUploadFileType('pdf');
    setUploadTags([]);
    setTagInput('');
    setUploadError('');
  };

  // Filters logic
  const filteredNotes = notes.filter((note) => {
    const searchValue = searchTerm.toLowerCase().trim();

    const matchesSearch =
      note.title.toLowerCase().includes(searchValue) ||
      note.description.toLowerCase().includes(searchValue) ||
      note.category.toLowerCase().includes(searchValue) ||
      note.tags.some((t) => t.toLowerCase().includes(searchValue));

    const matchesCat =
     selectedCategory === 'all' ||
     (selectedCategory === 'saved'
       ? bookmarkedNotes.includes(note.id)
       : selectedCategory === 'my'
          ? note.authorId === currentUser?.id
          : note.category.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase());
     return matchesSearch && matchesCat;
});

  return (
    <div className="flex flex-col gap-6">
      
      {/* Search Header */}
      <div className="bg-slate-900 rounded-3xl p-6 lg:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-transparent to-indigo-600/20 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-400/20 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <Sparkles size={13} className="fill-blue-400/20" />
            AI-Powered Learn Engine Installed
          </div>
          <h1 className="text-2xl md:text-3.5xl font-display font-bold tracking-tight">
            Academic Notes Hub
          </h1>
          <p className="text-slate-400 text-sm">
            Search peer documents and instantly generate interactive summaries, active-recall flashcards, and testing quizzes powered by Gemini.
          </p>
        </div>

        <button
          id="trigger-upload-btn"
          onClick={() => {
            if (!currentUser) {
              onTriggerLogin();
            } else {
              setShowUploadModal(true);
            }
          }}
          className="relative z-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 self-start md:self-center cursor-pointer"
        >
          <UploadCloud size={20} />
          <span>Share Note Draft</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-3.5 text-slate-400"><Search size={18} /></span>
          <input
            id="notes-search-input"
            type="text"
            placeholder="Search titles, formulas, tags or definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 text-sm text-slate-800 bg-white"
          />
        </div>

        {/* Quick view counters */}
        <div className="text-xs text-slate-500 font-mono self-end md:self-center">
          Showing <span className="font-bold text-slate-700">{filteredNotes.length}</span> of {notes.length} notes
        </div>
      </div>

      {/* Category Pills Roller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
        <button
          id="cat-pill-all"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 border-slate-900 text-white'
              : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Subjects
        </button>
        <button
  type="button"
  onClick={() => {
    setSearchTerm("");
    setSelectedCategory("saved");
  }}
  className="px-4 py-2 text-xs font-semibold rounded-full border bg-white text-slate-700 hover:bg-pink-50"
>
  ❤️ Saved Notes
</button>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              id={`cat-pill-${cat.slug}`}
              key={cat.slug}
             onClick={() => {
               setSearchTerm('');
               setSelectedCategory(cat.slug);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Notes Catalog Map */}
      {filteredNotes.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto w-full flex flex-col items-center gap-3">
          <BookOpen size={40} className="text-slate-400 stroke-[1.5]" />
          <h3 className="font-display font-bold text-slate-800">No Lecture Notes Found</h3>
          <p className="text-slate-500 text-xs px-2">
            No notes match your current search queries or selections. Try typing different keywords or share a new note draft yourself.
          </p>
          <button
            id="empty-upload-trigger-btn"
            onClick={() => {
              if (!currentUser) onTriggerLogin();
              else setShowUploadModal(true);
            }}
            className="mt-2 text-xs font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 cursor-pointer"
          >
            Upload Notes Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => {
            const catInfo = CATEGORIES.find(c => c.slug === note.category) || CATEGORIES[0];
            const CatIcon = catInfo.icon;
            
            return (
              <div
                id={`note-card-${note.id}`}
                key={note.id}
                onClick={() => {
                  setViewNote(note);
                  onSelectNote(note);
                }}
                className="group relative flex flex-col bg-white border border-slate-200/90 hover:border-blue-500/50 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(note.id);
                   }}
                   className="absolute top-4 right-4 z-10 rounded-full p-2 bg-white shadow-md border border-slate-200 hover:bg-blue-50"
                 >
                   <Heart
                     size={18}
                     className={
                       bookmarkedNotes.includes(note.id)
                         ? "fill-red-500 text-red-500"
                         : "text-slate-400"
                    }
                  />
                </button>
                {/* Banner Strip */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className={`py-1 px-2.5 rounded-lg border text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider select-none ${catInfo.color}`}>
                    <CatIcon size={13} />
                    <span>
                      {note.category === "science" ? "Science" : catInfo.name}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] bg-slate-100 text-slate-500 py-0.5 px-2 rounded-md uppercase font-bold tracking-wide">
                    {note.fileType}
                  </span>
                </div>

                <h3 className="text-slate-950 font-display font-extrabold group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight text-sm tracking-tight mb-2">
                  {note.title}
                </h3>

                <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed flex-grow">
                  {note.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {note.tags.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title="Views count">
                      <Eye size={13} /> {note.views}
                    </span>
                    <span className="flex items-center gap-1" title="Downloads count">
                      <Download size={12} /> {note.downloads}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold" title="Rating score">
                      <Star size={12} className="fill-amber-400 stroke-amber-500" /> {note.rating || 'New'}
                    </span>
                  </div>
                  <span className="font-medium text-slate-600 truncate max-w-[100px]" title={`Uploaded by ${note.author}`}>
                    By {note.author}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
{/* Note View Popup */}
{viewNote && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-slate-950 px-6 py-5 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            {viewNote.category}
          </p>

          <h2 className="mt-1 text-xl font-bold">
            {viewNote.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setViewNote(null)}
          className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      <div className="p-6">

        <div className="mb-6 rounded-2xl bg-blue-50 p-5">
          <h3 className="mb-2 font-bold text-slate-800">
            Description
          </h3>

          <p className="text-sm leading-6 text-slate-600">
            {viewNote.description}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">

  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-xs text-slate-400">Subject</p>
    <p className="mt-1 text-sm font-bold text-slate-700">
      {viewNote.category}
    </p>
  </div>

  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-xs text-slate-400">File Type</p>
    <p className="mt-1 text-sm font-bold text-slate-700 uppercase">
      {viewNote.fileType}
    </p>
  </div>

  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-xs text-slate-400">Views</p>
    <p className="mt-1 text-sm font-bold text-slate-700">
      {viewNote.views || 0}
    </p>
  </div>

  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-xs text-slate-400">Downloads</p>
    <p className="mt-1 text-sm font-bold text-slate-700">
      {viewNote.downloads || 0}
    </p>
  </div>

</div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />

            <h3 className="font-bold text-slate-800">
              Study Notes
            </h3>
          </div>

          <div className="whitespace-pre-wrap rounded-xl bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm">
            {viewNote.content}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {viewNote.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="text-xs text-slate-500">
            By <span className="font-semibold">{viewNote.author}</span>
          </div>

          <button
            type="button"
            onClick={() => setViewNote(null)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
)}
      {/* Uploader Popup Overlay */}
      {showUploadModal && (
        <div id="upload-overlay-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 my-8 flex flex-col h-fit max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud size={20} className="text-blue-400" />
                <h3 className="font-display font-bold text-lg">Share Notes Workspace</h3>
              </div>
              <button
                id="close-upload-btn"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Form Scrollable */}
            <form onSubmit={handleUploadSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
              
              {uploadError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-lg flex items-start gap-2 text-xs">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Drag n Drop Sandbox */}
              <div
                id="drag-upload-box"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />
                <UploadCloud size={32} className={`stroke-[1.5] ${dragActive ? 'text-blue-600 animate-bounce' : 'text-slate-400'}`} />
                <p className="text-xs font-semibold text-slate-700">
                  Drag & Drop draft note file here, or <span className="text-blue-600 hover:underline">browse files</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Accepts PDF, DOC, DOCX, TXT, PPT (Max 15MB)
                </p>
              </div>

              {/* Grid 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Note Outline Title</label>
                  <input
                    id="upload-title-input"
                    type="text"
                    required
                    placeholder="e.g. Organic Chemistry - Carbonyl addition"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Academic Subject</label>
                  <select
                    id="upload-category-select"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as CategoryType)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Brief Overview / Description</label>
                <input
                  id="upload-desc-input"
                  type="text"
                  placeholder="Summarize what lecture days, chapters or formulas are covered in these study sheets..."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              {/* Dynamic Type option */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Note Document Structure</label>
                  <select
                    id="upload-filetype-select"
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="pdf">Portable Document Format (PDF)</option>
                    <option value="doc">Microsoft Word Sheet (DOC)</option>
                    <option value="txt">ASCII Plain Text File (TXT)</option>
                    <option value="ppt">PowerPoint Slide Desk (PPT)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Categorization tags</label>
                  <div className="relative flex items-center justify-between border border-slate-200 rounded-lg bg-white overflow-hidden pr-2">
                    <input
                      id="upload-tag-input"
                      type="text"
                      placeholder="Add key tags e.g. 'mechanic'..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="px-3 py-2 text-sm focus:outline-none text-slate-800 flex-1"
                    />
                    <button
                      id="add-tag-btn"
                      type="button"
                      onClick={handleAddTag}
                      className="bg-slate-100 p-1 rounded text-slate-600 text-xs font-semibold hover:bg-slate-200"
                    >
                      Add
                    </button>
                  </div>
                  {/* Tag list */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {uploadTags.map((t, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span>#{t}</span>
                        <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-red-600"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Area for note details context */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Detailed Notes & Lecture Text Context (Used by Gemini AI)
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    🔑 Crucial for accurate AI summary
                  </span>
                </div>
                <textarea
                  id="upload-content-input"
                  required
                  placeholder="Paste your raw lecture transcription copy, bullet points, study guide parameters, textbook definitions, or math problems here. The Gemini AI utilizes this text content dynamically to generate card metrics, study guides, and test questions."
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-800 text-xs font-mono h-40 resize-y"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 justify-end border-t border-slate-100 pt-4 mt-2">
                <button
                  id="cancel-upload-btn"
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Discard Draft
                </button>
                <button
                  id="submit-upload-btn"
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
                >
                  {uploading ? "Indexing Draft..." : "Publish & Share Note"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
