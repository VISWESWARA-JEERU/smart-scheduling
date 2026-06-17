import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  MoreVertical,
  ArrowRight,
  Building2,
  CalendarDays,
  ListFilter,
  RotateCcw,
  X,
  Activity,
  Clock,
  AlertCircle,
} from 'lucide-react';
// import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import jsPDF from 'jspdf';

import API from '../services/api';
import KPICards from '../components/KPICards';
import MonthlyChart from '../charts/MonthlyChart';
import ClinicChart from '../charts/ClinicChart';
import RequestTypeChart from '../charts/RequestTypeChart';

function Dashboard() {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [requestTypeData, setRequestTypeData] = useState([]);
  const [kpiData, setKpiData] = useState({});
  const [selectedClinic, setSelectedClinic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const monthlyChartRef = useRef(null);
  const clinicChartRef = useRef(null);
  const requestTypeChartRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const monthNames = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthLabel = selectedMonth ? monthNames[selectedMonth] : "All Months";
  const yearLabel = selectedYear ? selectedYear : "All Years";

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear, selectedClinic]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [monthlyRes, clinicRes, requestTypeRes, kpiRes] = await Promise.all([
        API.get('/monthly-requests', {
          params: {
            year: selectedYear || undefined,
          },
        }),
        API.get('/clinic-requests', {
          params: {
            month: selectedMonth || undefined,
            year: selectedYear || undefined,
          },
        }),
        API.get('/request-types', {
          params: {
            month: selectedMonth || undefined,
            year: selectedYear || undefined,
            clinic: selectedClinic || undefined,
          },
        }),
        API.get('/kpi', {
          params: {
            month: selectedMonth || undefined,
            year: selectedYear || undefined,
            clinic: selectedClinic || undefined,
          },
        }),
      ]);
      const res = await API.get("/analytics/clinic",
        {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        }
      );
     



      setMonthlyData(monthlyRes.data);
      setClinicData(clinicRes.data);
      setRequestTypeData(requestTypeRes.data);
      setKpiData(kpiRes.data);

      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const exportPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const contentWidth = pageWidth - margin * 2;

    const drawBorder = () => {
      pdf.setDrawColor(30, 41, 59);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, margin, contentWidth, pageHeight - margin * 2);
    };

    const drawFooter = () => {
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `Report Generated On: ${new Date().toLocaleDateString()}`,
        margin + 5,
        pageHeight - 15
      );
    };

    const getRequestTotal = (name) => {
      return (
        requestTypeData.find((item) => item.user_request === name)?.total || 0
      );
    };

    const drawTitleAndFilters = () => {
      pdf.setFontSize(20);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.text("AI Voice Agent Metrics Report", pageWidth / 2, 20, {
        align: "center",
      });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      pdf.setFillColor(241, 245, 249);
      pdf.rect(20, 30, 170, 26, "F");

      pdf.setDrawColor(203, 213, 225);
      pdf.rect(20, 30, 170, 26);

      pdf.line(105, 30, 105, 56);
      pdf.line(20, 43, 190, 43);

      pdf.setFont("helvetica", "bold");
      pdf.text("Month & Year", 25, 39);
      pdf.text("Clinic", 110, 39);

      pdf.setFont("helvetica", "normal");
      pdf.text(`${monthLabel} ${yearLabel}`, 25, 52);
      pdf.text(selectedClinic || "All Clinics", 110, 52);
    };

    const drawKPICard = (x, y, title, value, color, percent) => {
      pdf.setFillColor(color.r, color.g, color.b);
      pdf.roundedRect(x, y, 40, 23, 3, 3, "F");

      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(title, x + 4, y + 8);

      pdf.setFontSize(15);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(value || 0), x + 4, y + 17);

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);

      const pct = typeof percent === "number" ? percent : 0;
      pdf.text(`${pct.toFixed(2)}% of calls`, x + 4, y + 21);
    };

    const drawKPIs = () => {
      const total = Number(kpiData?.total_requests || 0) || 0;

      drawKPICard(
        20,
        67,
        "Total Requests",
        total,
        { r: 219, g: 234, b: 254 },
        total ? 100 : 0
      );

      drawKPICard(
        65,
        67,
        "Appointments",
        getRequestTotal("Appointment Confirmation/Inquiry"),
        { r: 220, g: 252, b: 231 },
        total
          ? (getRequestTotal("Appointment Confirmation/Inquiry") / total) * 100
          : 0
      );

      drawKPICard(
        110,
        67,
        "Front Desk",
        getRequestTotal("Front Desk Request"),
        { r: 237, g: 233, b: 254 },
        total ? (getRequestTotal("Front Desk Request") / total) * 100 : 0
      );

      drawKPICard(
        155,
        67,
        "Silent Calls",
        getRequestTotal("No User Request (Silent Call)"),
        { r: 254, g: 226, b: 226 },
        total
          ? (getRequestTotal("No User Request (Silent Call)") / total) * 100
          : 0
      );
    };

    const addProportionalImage = (base64Image, x, y, maxWidth, maxHeight) => {
      const imgProps = pdf.getImageProperties(base64Image);
      const imgRatio = imgProps.width / imgProps.height;
      const maxRatio = maxWidth / maxHeight;

      let finalWidth;
      let finalHeight;

      if (imgRatio > maxRatio) {
        finalWidth = maxWidth;
        finalHeight = maxWidth / imgRatio;
      } else {
        finalHeight = maxHeight;
        finalWidth = maxHeight * imgRatio;
      }

      const xOffset = x + (maxWidth - finalWidth) / 2;

      pdf.addImage(base64Image, "PNG", xOffset, y, finalWidth, finalHeight);

      return finalHeight;
    };

    drawBorder();
    drawTitleAndFilters();
    drawKPIs();

    if (clinicChartRef.current) {
      const clinicImage = clinicChartRef.current.toBase64Image();

      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Clinic Requests Chart - ${selectedClinic || "All Clinics"}`, 20, 105);

      addProportionalImage(clinicImage, 20, 118, 170, 200);
    }

    drawFooter();

    if (requestTypeChartRef.current || monthlyChartRef.current) {
      pdf.addPage();
      drawBorder();

      let currentY = 25;

      if (requestTypeChartRef.current) {
        pdf.setFontSize(16);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `Request Type Chart - ${selectedClinic || "All Clinics"}`,
          pageWidth / 2,
          currentY,
          { align: "center" }
        );

        currentY += 8;

        const requestTypeImage =
          requestTypeChartRef.current.toBase64Image();

        const actualHeight = addProportionalImage(
          requestTypeImage,
          20,
          currentY,
          170,
          110
        );

        currentY += actualHeight + 20;
      }
      
      if (monthlyChartRef.current) {
        pdf.setFontSize(16);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.text("Monthly Requests Chart", pageWidth / 2, currentY, {
          align: "center",
        });

        currentY += 8;

        const monthlyImage = monthlyChartRef.current.toBase64Image();
        const remainingHeight = pageHeight - currentY - 25;

        addProportionalImage(monthlyImage, 20, currentY, 170, remainingHeight);
      }

      drawFooter();
    }

    pdf.save(`AI_Report_${monthLabel}_${yearLabel}.pdf`);
  };







  const uniqueClinics = [...new Set(clinicData.map((item) => item.clinic_name))];

  const handleClearFilters = () => {
    setSelectedMonth(currentDate.getMonth() + 1);
    setSelectedYear(currentDate.getFullYear());
    setSelectedClinic('');
  };

  const getFormattedTime = () => {
    return lastUpdated.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} /> */}

      <main className="min-h-screen flex-1 overflow-x-hidden p-5 lg:p-8">
        <Topbar
          lastUpdated={lastUpdated}
          onExportPDF={exportPDF}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="mt-0 space-y-6">
          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-[130px_1fr_1fr_1fr_120px] md:items-end">
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 px-4">
                <ListFilter size={18} className="text-slate-700" />
                <span className="font-semibold text-slate-800">Filters</span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month || "All Months"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
                >
                  {[2022, 2023, 2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Clinic
                </label>
                <select
                  value={selectedClinic}
                  onChange={(e) => setSelectedClinic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
                >
                  <option value="">All Clinics</option>
                  {uniqueClinics.map((clinic) => (
                    <option key={clinic} value={clinic}>
                      {clinic}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleClearFilters}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw size={16} />
                Clear All
              </button>
            </div>
          </div>

          {/* KPI */}
          <KPICards data={kpiData} requestData={requestTypeData} />

          {/* Charts */}
          {isLoading ? (
            <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <p className="text-slate-600">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 size={22} className="text-slate-900" />
                        <h3 className="text-lg font-bold text-slate-900">
                          Clinic Requests - {monthNames[selectedMonth] || "All Months"} {selectedYear}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Total number of AI voice agent requests handled by each clinic.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate("/analytics/clinic")}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        View Details <ArrowRight size={14} className="inline" />
                      </button>
                      <MoreVertical size={20} className="text-slate-500" />
                    </div>
                  </div>

                  <ClinicChart
                    ref={clinicChartRef}
                    data={clinicData}
                    title=""
                    selectedClinic={selectedClinic}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CalendarDays size={22} className="text-slate-900" />
                        <h3 className="text-lg font-bold text-slate-900">
                          Monthly Requests - {selectedYear}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Monthly request trends for the selected year and clinic filter.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate("analytics/monthly-requests")}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        View Details <ArrowRight size={14} className="inline" />
                      </button>
                      <MoreVertical size={20} className="text-slate-500" />
                    </div>
                  </div>

                  <MonthlyChart ref={monthlyChartRef} data={monthlyData} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Request Types - {selectedClinic || "All Clinics"}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Breaks down request categories by type.
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/analytics/request-types")}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      View Details →
                    </button>
                  </div>

                  <RequestTypeChart
                    ref={requestTypeChartRef}
                    data={requestTypeData}
                    title=""
                  />
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">
                    Request Type Insights
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    This chart shows the distribution of requests handled by the AI Voice Agent
                    across all clinics. It helps identify the most common user intents and
                    service categories.
                  </p>

                  <div className="mt-5 space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Most Requested Services
                      </h4>
                      <p className="text-sm text-slate-600">
                        Identify which request types generate the highest call volume.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Operational Insights
                      </h4>
                      <p className="text-sm text-slate-600">
                        Understand user behavior and optimize workflows for frequently
                        requested services.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Performance Monitoring
                      </h4>
                      <p className="text-sm text-slate-600">
                        Track changes in request distribution over time using filters for
                        month, year, and clinic.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-white p-4">
                    <h4 className="font-semibold text-slate-900">
                      View Details
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Access detailed analytics including request counts, percentages,
                      clinic-wise breakdowns, and historical trends.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-slate-500">
                All data is displayed based on selected filters. Data is refreshed automatically.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
export default Dashboard; 