import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import API from "../services/api";
import "../index.css";
import { ListFilter, AudioLines, Sun, Moon } from "lucide-react";

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
  const [darkMode, setDarkMode] = useState(false);

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

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

  const monthLabel = selectedMonth ? monthNames[selectedMonth] : "All Months";
  const yearLabel = selectedYear ? selectedYear : "All Years";

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear, selectedClinic]);

  const fetchDashboardData = async () => {
    try {
      const monthlyRes = await API.get("/monthly-requests", {
        params: {
          year: selectedYear || undefined,
        },
      });

      const clinicRes = await API.get("/clinic-requests", {
        params: {
          month: selectedMonth || undefined,
          year: selectedYear || undefined,
        },
      });

      const params = {
        month: selectedMonth || undefined,
        year: selectedYear || undefined,
        clinic: selectedClinic || undefined,
      };

      const requestTypeRes = await API.get("/request-types", { params });
      const kpiRes = await API.get("/kpi", { params });

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
      pdf.text(`Clinic Requests Chart - ${selectedClinic}`, 20, 105);

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

  return (
    <div
      className={
        darkMode
          ? "min-h-screen w-full bg-slate-950 text-white"
          : "min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-slate-900"
      }
    >
      <main className="min-h-screen w-full p-5 sm:p-7">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <AudioLines strokeWidth={1} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                AI Voice Agent Metrics
              </h1>
              <p
                className={
                  darkMode
                    ? "mt-2 text-sm text-slate-300"
                    : "mt-2 text-sm text-slate-600"
                }
              >
                Track and analyze AI voice agent performance across all clinics.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Light/Dark Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"
            >
              <Sun
                size={16}
                className={darkMode ? "text-slate-400" : "text-yellow-500"}
              />

              <span
                className={
                  darkMode
                    ? "relative h-6 w-11 rounded-full bg-blue-600"
                    : "relative h-6 w-11 rounded-full bg-slate-300"
                }
              >
                <span
                  className={
                    darkMode
                      ? "absolute right-1 top-1 h-4 w-4 rounded-full bg-white"
                      : "absolute left-1 top-1 h-4 w-4 rounded-full bg-white"
                  }
                />
              </span>

              <Moon
                size={16}
                className={darkMode ? "text-blue-500" : "text-slate-400"}
              />
            </button>

            {/* <p
              className={
                darkMode
                  ? "text-sm text-slate-300"
                  : "text-sm text-slate-600"
              }
            >
              Last updated: 2 min ago
            </p> */}

            <button
              type="button"
              onClick={exportPDF}
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2.5 text-center leading-5"
              >
              Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className={
            darkMode
              ? "w-6/8 mb-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm"
              : "w-6/8 mb-6 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur"
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[70px_1fr_1fr_1fr] items-center">
            <div className={
              darkMode
                ? "h-18 w-11 flex items-center justify-center rounded-xl  border-none"
                : "h-18 w-11 flex items-center justify-center rounded-xl  border-none"
            }
            >
              <ListFilter size={30} strokeWidth={1.75} className={darkMode ? "text-slate-400" : "text-white-600"}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="month"
                className={
                  darkMode
                    ? "mb-2 text-sm font-semibold text-slate-300"
                    : "mb-2 text-sm font-semibold text-slate-600"
                }
              >
                Month
              </label>

              <select
                id="month"
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className={
                  darkMode
                    ? "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
                    : "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }
              >
                <option value="">All Months</option>
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
                className={
                  darkMode
                    ? "mb-2 text-sm font-semibold text-slate-300"
                    : "mb-2 text-sm font-semibold text-slate-600"
                }
              >
                Year
              </label>

              <select
                id="year"
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className={
                  darkMode
                    ? "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
                    : "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }
              >
                <option value="">All Years</option>
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="clinic"
                className={
                  darkMode
                    ? "mb-2 text-sm font-semibold text-slate-300"
                    : "mb-2 text-sm font-semibold text-slate-600"
                }
              >
                Clinic
              </label>

              <select
                id="clinic"
                value={selectedClinic}
                onChange={(e) => setSelectedClinic(e.target.value)}
                className={
                  darkMode
                    ? "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
                    : "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }
              >
                <option value="">All Clinics</option>

                {clinicData.map((clinic) => (
                  <option key={clinic.clinic_name} value={clinic.clinic_name}>
                    {clinic.clinic_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <KPICards data={kpiData} requestData={requestTypeData} />
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <ClinicChart
            ref={clinicChartRef}
            data={clinicData}
            selectedClinic={selectedClinic}
            title={
              selectedClinic
                ? `Clinic Requests - ${monthLabel} ${yearLabel} - ${selectedClinic}`
                : `Clinic Requests - ${monthLabel} ${yearLabel}`
            }
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RequestTypeChart
              ref={requestTypeChartRef}
              data={requestTypeData}
              title={`Request Types - ${selectedClinic || "All Clinics"}`}
            />

            <MonthlyChart ref={monthlyChartRef} data={monthlyData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;