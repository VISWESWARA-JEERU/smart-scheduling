import { useEffect, useState } from "react";
import { Bell, Download, Menu, Moon, RefreshCw, Sun,Activity} from "lucide-react";

const Topbar = ({ onMenuClick, onExportPDF }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const formattedDateTime = currentTime.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="flex items-center justify-between px-6 py-5 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-4">
        
         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
              <Activity size={28} strokeWidth={2} className="text-white" />
            </div>

            
        <div>
          
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Voice Agent - Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of AI voice agent performance across all clinics.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-xs font-medium text-slate-500 xl:flex">
          <span>Last updated: {formattedDateTime}</span>
          <RefreshCw size={12} />
        </div>

        {/* <button
          type="button"
          onClick={toggleDarkMode}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm hover:bg-slate-50"
        >
          <Sun
            size={15}
            className={darkMode ? "text-slate-400" : "text-yellow-500"}
          />
          <Moon
            size={15}
            className={darkMode ? "text-blue-600" : "text-slate-400"}
          />
        </button>

        <button className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm hover:bg-slate-50">
          <Bell size={15} />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button> */}

        <button
          type="button"
          onClick={onExportPDF}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>
    </header>
  );
};

export default Topbar;