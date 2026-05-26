function Sidebar() {

  return (

    <div className="min-h-screen w-60 border-r border-gray-200 bg-white p-6 sm:p-7 md:w-64">
      <h2 className="mb-6 text-xl font-semibold text-slate-700">Menu</h2>

      <ul>
        <li className="mb-3 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-slate-100">Dashboard</li>
        <li className="mb-3 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-slate-100">Analytics</li>
        <li className="cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-slate-100">Reports</li>
      </ul>
    </div>

  );
}

export default Sidebar;