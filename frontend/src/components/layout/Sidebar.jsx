import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Building2,
  ChevronDown,
  FileText,
  Headphones,
  Home,
  Info,
  LineChart,
  Menu,
  Settings,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const [analyticsOpen, setAnalyticsOpen] = useState(
    location.pathname.startsWith("/analytics")
  );

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/" },
    {
      id: "analytics",
      label: "Analytics",
      icon: LineChart,
      path: "/analytics",
      submenu: [
        {
          id: "clinic",
          label: "Clinic Analytics",
          path: "/analytics/clinic",
        },
        {
          id: "monthly",
          label: "Monthly Analytics",
          path: "/analytics/monthly",
        },
        {
          id: "request-type",
          label: "Request Type Analytics",
          path: "/analytics/request-type",
        },
      ],
    },
    { id: "clinics", label: "Clinics", icon: Building2, path: "/clinics" },
    // { id: "reports", label: "Reports", icon: FileText, path: "/reports" },
    // { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-[440px] w-[220px] flex-col rounded-r-3xl bg-[#06142B] text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
  isOpen ? "translate-x-0" : "-translate-x-full"
}`}
      >
        {/* Logo */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
              <Activity size={28} strokeWidth={2} className="text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                AI Voice Agent
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-300">
                Smart Scheduling
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = Boolean(item.submenu?.length);
            const active = isActive(item.path);
            const submenuOpen = item.id === "analytics" && analyticsOpen;

            return (
              <div key={item.id}>
                {hasSubmenu ? (
                  <button
                    type="button"
                    onClick={() => setAnalyticsOpen(!submenuOpen)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      active || submenuOpen
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={20} strokeWidth={2} />
                      {item.label}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        submenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} />
                    {item.label}
                  </Link>
                )}

                {hasSubmenu && submenuOpen && (
                  <div className="mt-2 space-y-1 rounded-xl bg-white/5 p-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.id}
                        to={subitem.path}
                        onClick={() => setIsOpen(false)}
                        className={`block rounded-lg px-4 py-2.5 text-sm transition-all ${
                          location.pathname === subitem.path
                            ? "bg-blue-500 text-white"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* About Dashboard */}
        {/* <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-3">
            <Info size={22} className="text-blue-400" />
            <h3 className="font-semibold text-white">About Dashboard</h3>
          </div>

          <p className="text-sm leading-6 text-slate-300">
            This dashboard provides real-time insights into AI voice agent
            performance. Use filters to explore data by month, year, or clinic.
          </p>
        </div> */}

        {/* Help Card */}
        {/* <div className="mx-4 mb-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-3">
            <Headphones size={24} className="text-white" />
            <h3 className="font-semibold text-white">Need Help?</h3>
          </div>

          <p className="mb-4 text-sm leading-6 text-slate-300">
            Our support team is available to help you.
          </p>

          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-700"
          >
            Contact Support
          </button>
        </div> */}

        {/* Mobile close */}
        {/* <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
        >
          <X size={22} />
        </button> */}
      </aside>

      {/* Mobile open button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-xl bg-blue-600 p-3 text-white shadow-lg lg:hidden"
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default Sidebar;

