import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import '../src/index.css';
// import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import ClinicDetails from './pages/analytics/ClinicDetails';
import MonthlyRequestsDetails from './pages/analytics/MonthlyRequestsDetails';
import RequestTypesDetails from './pages/analytics/RequestTypesDetails';
import TotalRequestsDetails from "./pages/analytics/TotalRequestsDetails";
import AppointmentConfirmationDetails from "./pages/analytics/AppointmentConfirmationDetails"
import FrontDeskDetails from "./pages/analytics/FrontDeskDetails";
import SilentCallsDetails from './pages/analytics/SilentCallsDetails';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} /> */}

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Topbar */}
          {/* <Topbar onMenuClick={() => setSidebarOpen(true)} /> */}

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics/clinic" element={<ClinicDetails />} />
              <Route path="/analytics/monthly-requests" element={<MonthlyRequestsDetails />} />
              <Route path="/analytics/request-types" element={<RequestTypesDetails />} />
              <Route path="/analytics/total-requests" element={<TotalRequestsDetails />} />
              <Route path="/analytics/appointment-confirmation" element={<AppointmentConfirmationDetails />} />
              <Route path="/analytics/front-desk" element={<FrontDeskDetails />}/>
              <Route path="/analytics/silent-calls" element={<SilentCallsDetails />} />
              <Route path="/analytics/clinic" element={<ClinicDetails />} />
              





              {/* Placeholder routes for future pages */}
              <Route path="/clinics" element={<div className="p-6"><h1 className="text-2xl font-bold">Clinics</h1></div>} />
              <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div>} />
              <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

