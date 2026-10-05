import { useState } from "react";


import {
  Users,
  FileText,
  Bookmark,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  notes: any[];
  setNotes: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function AdminDashboard({
  onClose,
  notes,
  setNotes,
}: AdminDashboardProps) {

   const [noteSearch, setNoteSearch] = useState("");

   const filteredAdminNotes = notes.filter(
     (note: any) =>
       note.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
       note.category.toLowerCase().includes(noteSearch.toLowerCase())
);

   const users = JSON.parse(
  localStorage.getItem("notes_users") || "[]"
);
  
   const savedNotes = JSON.parse(
  localStorage.getItem("bookmarked_notes") || "[]"
);
  
  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      icon: Users,
},
    {
      title: 'Total Notes',
      value: notes.length.toString(),
      icon: FileText,
},
    {
      title: 'Saved Notes',
      value: savedNotes.length.toString(),
      icon: Bookmark,
},
    {
      title: 'Active Users',
      value: users.length.toString(),
      icon: BarChart3,
},
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-100 p-4">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-3 text-white">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Manage your NoteShare platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>

          <button
  type="button"
  onClick={() => {
    localStorage.removeItem("currentUser");
    onClose();
    window.location.reload();
  }}
  className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
>
  Logout
</button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Icon size={22} />
                  </div>
                </div>

                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                  {stat.value}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Recent Users */}
<div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
  <h2 className="text-lg font-bold text-slate-900">
    Recent Users
  </h2>

  <p className="mt-1 text-sm text-slate-500">
    Recently registered users on NoteShare.
  </p>

  <div className="mt-5 space-y-3">
    {users.length > 0 ? (
      users.slice(-5).reverse().map((user: any) => (
        <div
          key={user.email}
          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <div>
            <p className="font-semibold text-slate-800">
              {user.username}
            </p>

            <p className="text-xs text-slate-500">
              {user.email}
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            {user.role}
          </span>
        </div>
      ))
    ) : (
      <p className="text-sm text-slate-500">
        No users registered yet.
      </p>
    )}
  </div>
</div>
        
        {/* Management */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
  <h2 className="text-lg font-bold text-slate-900">
    User Management
  </h2>

  <p className="mt-2 text-sm text-slate-500">
    View registered users and manage platform access.
  </p>

  {/* Registered Users */}
  {users.length > 0 && (
    <div className="mt-5 space-y-2">
      {users.map((user: any) => (
        <div
          key={user.email}
          className="rounded-xl border border-slate-100 bg-slate-50 p-3"
        >
          <p className="font-semibold text-slate-800">
            {user.username}
          </p>

          <p className="text-xs text-slate-500">
            {user.email}
          </p>

          <p className="mt-1 text-xs text-indigo-600">
            Role: {user.role}
          </p>

          <button
  type="button"
  onClick={() => {
    if (window.confirm(`Delete user "${user.username}"?`)) {
      const updatedUsers = users.filter(
        (item: any) => item.email !== user.email
      );

      localStorage.setItem(
        "notes_users",
        JSON.stringify(updatedUsers)
      );

      window.location.reload();
    }
  }}
  className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
>
  Delete User
</button>
        </div>
      ))}
    </div>
  )}

  {/* No Users */}
  {users.length === 0 && (
    <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
      No registered users found.
    </div>
  )}

  <button
  type="button"
  onClick={() => {
    alert(`Total registered users: ${users.length}`);
  }}
  className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
>
  Manage Users
</button>
</div>
           <div className="rounded-2xl bg-white p-6 shadow-sm">
  <h2 className="text-lg font-bold text-slate-900">
    Notes Management
  </h2>

  <p className="mt-2 text-sm text-slate-500">
    View, manage and organize uploaded study notes.
  </p>
             
  <input
  type="text"
  value={noteSearch}
  onChange={(e) => setNoteSearch(e.target.value)}
  placeholder="Search notes..."
  className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
/>

  <div className="mt-5 rounded-xl bg-indigo-50 p-4">
    <p className="text-sm font-semibold text-indigo-700">
      Notes Available
    </p>

    <p className="mt-1 text-2xl font-bold text-slate-900">
  {notes.length}
</p>

    <p className="text-xs text-slate-500">
      Study notes currently available on the platform.
    </p>
  </div>

  <div className="mt-5 space-y-3">
  {notes.length > 0 ? (
    filteredAdminNotes.length > 0 ? (
      filteredAdminNotes.map((note: any) => (
        <div
          key={note.id}
          className="rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <p className="font-semibold text-slate-800">
            {note.title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {note.description}
          </p>

          <div className="mt-2 flex gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {note.category}
            </span>

            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
              {note.fileType}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${note.title}"?`)) {
                setNotes((currentNotes) =>
                  currentNotes.filter((item) => item.id !== note.id)
                );
              }
            }}
            className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            Delete Note
          </button>
        </div>
      ))
    ) : (
      <p className="text-sm text-slate-500">
        No matching notes found.
      </p>
    )
  ) : (
    <p className="text-sm text-slate-500">
      No notes available.
    </p>
  )}
</div>
  <div
    key={note.id}
    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
  >
    <p className="font-semibold text-slate-800">
      {note.title}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      {note.description}
    </p>
        <
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            {note.category}
          </span>

          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
            {note.fileType}
          </span>
        </div>

        <button
  type="button"
  onClick={() => {
    if (window.confirm(`Delete "${note.title}"?`)) {
      setNotes((currentNotes) =>
        currentNotes.filter((item) => item.id !== note.id)
      );
    }
  }}
  className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
>
  Delete Note
</button>
      </div>
    ))
  ) : (
    <p className="text-sm text-slate-500">
      No notes available.
    </p>
  )}
</div>

  <button
  type="button"
  onClick={() => setNoteSearch("")}
  className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
>
  Clear Search
</button>
</div>

        </div>

      </div>
    </div>
  );
}
