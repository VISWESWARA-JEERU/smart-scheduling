import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import API from "../services/api";
import "../index.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import KPICards from "../components/KPICards";
import MonthlyChart from "../charts/MonthlyChart";
import ClinicChart from "../charts/ClinicChart";
import RequestTypeChart from "../charts/RequestTypeChart";

function Dashboard() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [requestTypeData, setRequestTypeData] = useState([]);
  const [kpiData, setKpiData] = useState({});
  const [selectedClinic, setSelectedClinic] = useState("");

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const monthlyChartRef = useRef(null);
  const clinicChartRef = useRef(null);
  const requestTypeChartRef = useRef(null);

  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  const fetchDashboardData = async () => {
    try {
      const monthlyRes = await API.get("/monthly-requests", {
        params: {
          year: selectedYear,
        },
      });

      const clinicRes = await API.get("/clinic-requests", {
        params: {
          month: selectedMonth,
          year: selectedYear,
        },
      });

      const requestTypeRes = await API.get("/request-types", {
        params: {
          month: selectedMonth,
          year: selectedYear,
        },
      });

      const kpiRes = await API.get("/kpi", {
        params: {
          month: selectedMonth,
          year: selectedYear,
        },
      });

      setMonthlyData(monthlyRes.data);
      setClinicData(clinicRes.data);
      setRequestTypeData(requestTypeRes.data);
      setKpiData(kpiRes.data);
    } catch (error) {
      console.log(error);
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

  const monthLabel = monthNames[selectedMonth];

  const drawTitleAndFilters = () => {
    pdf.setFontSize(20);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.text("AI Voice Agent Metrics Report", pageWidth / 2, 20, {
      align: "center",
    });

    // Filter table moved slightly up
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
    pdf.text(`${monthLabel} ${selectedYear}`, 25, 52);
    pdf.text(selectedClinic || "All Clinics", 110, 52);
  };

  const drawKPICard = (x, y, title, value, color) => {
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.roundedRect(x, y, 40, 23, 3, 3, "F");

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(title, x + 4, y + 8);

    pdf.setFontSize(15);
    pdf.setFont("helvetica", "bold");
    pdf.text(String(value || 0), x + 4, y + 18);
  };

  const drawKPIs = () => {
    // KPI cards moved up, KPI Summary text removed
    drawKPICard(20, 64, "Total Requests", kpiData.total_requests, {
      r: 254,
      g: 243,
      b: 199,
    });

    drawKPICard(
      65,
      64,
      "Appointment",
      getRequestTotal("Appointment Confirmation/Inquiry"),
      { r: 220, g: 252, b: 231 }
    );

    drawKPICard(110, 64, "Front Desk", getRequestTotal("Front Desk Request"), {
      r: 219,
      g: 234,
      b: 254,
    });

    drawKPICard(
      155,
      64,
      "Silent Calls",
      getRequestTotal("No User Request (Silent Call)"),
      { r: 254, g: 226, b: 226 }
    );
  };

  // PAGE 1 - Clinic chart first
  drawBorder();
  drawTitleAndFilters();
  drawKPIs();

  if (clinicChartRef.current) {
    const clinicImage = clinicChartRef.current.toBase64Image();

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Clinic Requests Chart", 20, 98);

    // image height is controlled by last value: 115
    pdf.addImage(clinicImage, "PNG", 15, 104, 180, 115);
  }

  drawFooter();

  // PAGE 2 - Request Type chart
  if (requestTypeChartRef.current) {
    pdf.addPage();
    drawBorder();

    pdf.setFontSize(18);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.text("Request Type Chart", pageWidth / 2, 22, {
      align: "center",
    });

    const requestTypeImage = requestTypeChartRef.current.toBase64Image();

    // y = 32 reduces top gap
    // height = 145 increases chart size
    pdf.addImage(requestTypeImage, "PNG", 15, 32, 180, 145);

    drawFooter();
  }

  // PAGE 3 - Monthly chart
  if (monthlyChartRef.current) {
    pdf.addPage();
    drawBorder();

    pdf.setFontSize(18);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.text("Monthly Requests Chart", pageWidth / 2, 22, {
      align: "center",
    });

    const monthlyImage = monthlyChartRef.current.toBase64Image();

    // y = 35 reduces top gap
    // height = 130 controls image height
    pdf.addImage(monthlyImage, "PNG", 15, 35, 180, 130);

    drawFooter();
  }

  pdf.save(`AI_Report_${monthLabel}_${selectedYear}.pdf`);
};

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-7">
          <Navbar />

          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Dashboard Filters */}
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-white p-5 shadow-lg">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Dashboard Filters
                </h2>

                <p className="text-sm text-slate-500">
                  Filter dashboard analytics by month and year
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="month"
                    className="mb-1 text-sm font-semibold text-slate-600"
                  >
                    Month
                  </label>

                  <select
                    id="month"
                    value={selectedMonth}
                    onChange={(e) =>
                      setSelectedMonth(Number(e.target.value))
                    }
                    className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="year"
                    className="mb-1 text-sm font-semibold text-slate-600"
                  >
                    Year
                  </label>

                  <select
                    id="year"
                    value={selectedYear}
                    onChange={(e) =>
                      setSelectedYear(Number(e.target.value))
                    }
                    className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reports */}
            <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-white p-5 shadow-lg">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Reports
                </h2>

                <p className="text-sm text-slate-500">
                  Export reports based on selected filters
                </p>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="clinic"
                  className="mb-1 text-sm font-semibold text-slate-600"
                >
                  Clinics
                </label>

                <select
                  id="clinic"
                  value={selectedClinic}
                  onChange={(e) => setSelectedClinic(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">All Clinics</option>

                  {clinicData.map((clinic) => (
                    <option
                      key={clinic.clinic_name}
                      value={clinic.clinic_name}
                    >
                      {clinic.clinic_name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600">
                Export CSV
              </button>

              <button
                onClick={exportPDF}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600"
              >
                Export PDF
              </button>
            </div>
          </div>

          <div className="mb-6">
            <KPICards
              data={kpiData}
              requestData={requestTypeData}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <MonthlyChart
              ref={monthlyChartRef}
              data={monthlyData}
            />

            <ClinicChart
              ref={clinicChartRef}
              data={clinicData}
              title={`Clinic Requests - ${monthNames[selectedMonth]} ${selectedYear}`}
            />

            <div className="lg:col-span-2">
              <RequestTypeChart
                ref={requestTypeChartRef}
                data={requestTypeData}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;