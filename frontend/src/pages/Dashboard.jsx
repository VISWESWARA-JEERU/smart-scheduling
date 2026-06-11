import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

import API from "../services/api";
import "../index.css";

import Navbar from "../components/Navbar";
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

      const requestTypeRes = await API.get("/request-types", {
        params,
      });

      const kpiRes = await API.get("/kpi", {
        params,
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

   const monthLabel = selectedMonth ? monthNames[selectedMonth] : "All Months";
   const yearLabel = selectedYear ? selectedYear : "All Years";


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
        { r: 254, g: 243, b: 199 },
        total ? 100 : 0
      );
      drawKPICard(
        65,
        67,
        "Appointments",
        getRequestTotal("Appointment Confirmation/Inquiry"),
        { r: 220, g: 252, b: 231 },
        total ? (getRequestTotal("Appointment Confirmation/Inquiry") / total) * 100 : 0
      );
      drawKPICard(
        110,
        67,
        "Front Desk",
        getRequestTotal("Front Desk Request"),
        { r: 219, g: 234, b: 254 },
        total ? (getRequestTotal("Front Desk Request") / total) * 100 : 0
      );
      drawKPICard(
        155,
        67,
        "Silent Calls",
        getRequestTotal("No User Request (Silent Call)"),
        { r: 254, g: 226, b: 226 },
        total ? (getRequestTotal("No User Request (Silent Call)") / total) * 100 : 0
      );
    };

    // --- NEW HELPER FUNCTION ---
    // Calculates perfect proportions so images never stretch or squish
    const addProportionalImage = (base64Image, x, y, maxWidth, maxHeight) => {
      const imgProps = pdf.getImageProperties(base64Image);
      const imgRatio = imgProps.width / imgProps.height;
      const maxRatio = maxWidth / maxHeight;

      let finalWidth, finalHeight;

      if (imgRatio > maxRatio) {
        // Image is wider than bounds (Scale by width)
        finalWidth = maxWidth;
        finalHeight = maxWidth / imgRatio;
      } else {
        // Image is taller than bounds (Scale by height)
        finalHeight = maxHeight;
        finalWidth = maxHeight * imgRatio;
      }

      // Center the image horizontally if it was scaled by height
      const xOffset = x + (maxWidth - finalWidth) / 2;

      pdf.addImage(base64Image, "PNG", xOffset, y, finalWidth, finalHeight);

      return finalHeight; // Return height so we know where to place the next item
    };

    // ==========================================
    // PAGE 1 
    // ==========================================
    drawBorder();
    drawTitleAndFilters();
    drawKPIs();

    if (clinicChartRef.current) {
      const clinicImage = clinicChartRef.current.toBase64Image();
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Clinic Requests Chart", 20, 98);

      // Max width 170, max height 140
      addProportionalImage(clinicImage, 20, 104, 170, 140);
    }
    drawFooter();

    // ==========================================
    // PAGE 2 (Combined Doughnut & Monthly Chart)
    // ==========================================

    if (requestTypeChartRef.current || monthlyChartRef.current) {
      pdf.addPage();
      drawBorder();

      let currentY = 25; // Track vertical position dynamically

      // 1. First Chart: Doughnut
      if (requestTypeChartRef.current) {
        pdf.setFontSize(16);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Request Type Chart - ${selectedClinic || "All Clinics"}`, pageWidth / 2, currentY, { align: "center" });

        currentY += 8; // Move down for image

        const requestTypeImage = requestTypeChartRef.current.toBase64Image();

        // We limit max height to 110mm so the second chart can fit below it
        const actualHeight = addProportionalImage(requestTypeImage, 20, currentY, 170, 110);

        currentY += actualHeight + 20; // Move down past image + gap
      }

      // 2. Second Chart: Monthly
      if (monthlyChartRef.current) {
        pdf.setFontSize(16);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.text("Monthly Requests Chart", pageWidth / 2, currentY, { align: "center" });

        currentY += 8; // Move down for image

        const monthlyImage = monthlyChartRef.current.toBase64Image();

        // Limit remaining height so it doesn't cross the footer
        const remainingHeight = pageHeight - currentY - 25;
        addProportionalImage(monthlyImage, 20, currentY, 170, remainingHeight);
      }

      drawFooter();
    }

    pdf.save(`AI_Report_${monthLabel}_${yearLabel}.pdf`);
  };

  
  return (
    <div className="min-h-screen w-full bg-slate-100">
      <div className="flex min-h-screen w-full">

        <main className="flex-1 p-6 sm:p-7">
          <Navbar />
          <div className="mt-4 mb-6 flex justify-center items-center w-full bg-blue-800">
            <div className=" flex items-center gap-3 rounded-2xl bg-white p-5 shadow-lg mt-6 mb-6 border border-slate-200 transition-transform hover:-translate-y-1 ">
              {/* Dashboard Filters */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-14">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
              </svg>
              <div className="flex items-center jusify-between gap-12 w-full">
                <div className="flex flex-col">

                  <label
                    htmlFor="month"
                    className="mb-1 text-sm font-semibold text-slate-600 "
                  >

                    Month
                  </label>

                  <select
                    id="month"
                    value={selectedMonth}
                    onChange={(e) =>
                      setSelectedMonth(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    // className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition  focus:ring-2 focus:ring-blue-200 "
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
                    className="mb-1 text-sm font-semibold text-slate-600"
                  >
                    Year
                  </label>

                  <select
                    id="year"
                    value={selectedYear}
                    onChange={(e) =>
                      setSelectedYear(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">All Years</option>
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                  </select>
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
                <button type="button" className=" rounded-lg text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-m px-4 py-2.5 text-center leading-5
                  onClick={exportPDF}">Export PDF</button>
              </div>
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
              selectedClinic={selectedClinic}
              title={selectedClinic ? `Clinic Requests - ${monthLabel} ${yearLabel} - ${selectedClinic}`
                  : `Clinic Requests - ${monthLabel} ${yearLabel}`}
            />

            <div className="lg:col-span-2">
              <RequestTypeChart
                ref={requestTypeChartRef}
                data={requestTypeData}
                title={`Request Types - ${selectedClinic || "All Clinics"}`}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;