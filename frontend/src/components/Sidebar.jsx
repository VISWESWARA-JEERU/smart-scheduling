import { Link } from "react-router-dom";

function Sidebar() {
  return (

    <div className="min-h-screen w-50 border-r border-gray-200 bg-white p-6 sm:p-7 md:w-64">
      <h2 className="mb-6 text-xl font-bold text-slate-700">Menu</h2>

      <ul>
        <li className="mb-3 rounded-lg px-3 py-2 text-lg font-medium transition-colors hover:bg-slate-200">
          <Link to="/" className="block">
            Dashboard
          </Link>
        </li>

        <li className="mb-3 rounded-lg px-3 py-2 text-lg font-medium transition-colors hover:bg-slate-200">
          <span className="block text-slate-600">Analytics</span>
        </li>

        <li className="rounded-lg px-3 py-2 text-lg font-medium transition-colors hover:bg-slate-200">
          <Link to="/reports" className="block">
            Reports
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

