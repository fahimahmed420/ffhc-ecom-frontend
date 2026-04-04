import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="border border-gray-200 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-sm tracking-widest uppercase mb-2 text-gray-500">
          Dashboard Home
        </h2>

        <h1 className="text-xl font-semibold mb-2">
          Welcome back 👋
        </h1>

        <p className="text-sm text-gray-500">
          Here’s a quick overview of your account and activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border p-4 bg-white rounded-lg shadow-sm">
          <p className="text-xs text-gray-500">Total Orders</p>
          <h3 className="text-lg font-semibold">12</h3>
        </div>

        <div className="border p-4 bg-white rounded-lg shadow-sm">
          <p className="text-xs text-gray-500">Saved Items</p>
          <h3 className="text-lg font-semibold">5</h3>
        </div>

        <div className="border p-4 bg-white rounded-lg shadow-sm">
          <p className="text-xs text-gray-500">Account Status</p>
          <h3 className="text-lg font-semibold text-green-600">Active</h3>
        </div>
      </div>

      {/* Profile Section */}
      <div className="border border-gray-200 p-6 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">
            Complete your profile
          </h3>
          <p className="text-sm text-gray-500">
            Add or update your personal information to get a better experience.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="dashboard/profile">
            <button className="px-5 py-2 text-sm bg-black text-white hover:bg-gray-800 transition rounded-md">
              Go to Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}