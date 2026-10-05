import {
  Users,
  FileText,
  Bookmark,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({
  onClose,
}: AdminDashboardProps) {
  const stats = [
    {
      title: 'Total Users',
      value: '12',
      icon: Users,
    },
    {
      title: 'Total Notes',
      value: '6',
      icon: FileText,
    },
    {
      title: 'Saved Notes',
      value: '8',
      icon: Bookmark,
    },
    {
      title: 'Active Users',
      value: '9',
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

        {/* Management */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Notes Management
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View, manage and organize uploaded study notes.
            </p>

            <button
              type="button"
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Manage Notes
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              User Management
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View registered users and manage platform access.
            </p>

            <button
              type="button"
              className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Manage Users
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
