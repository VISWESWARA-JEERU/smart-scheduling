import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  PhoneCall,
  Clock,
  TrendingUp,
  TrendingDown,
  ListFilter,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "chart.js/auto";

function MonthlyRequestsDetails() {
  const navigate = useNavigate();
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedClinic, setSelectedClinic] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    fetchMonthlyDetails();
  }, [selectedMonth, selectedYear, selectedClinic]);

  const fetchMonthlyDetails = async () => {
    try {
      setLoading(true);

      const res = await API.get("/analytics/monthly-requests", {
        params: {
          month: selectedMonth,
          year: selectedYear,
          clinic: selectedClinic || undefined,
        },
      });

      setData(res.data);
    } catch (error) {
      console.error("Monthly Requests Details API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const lineData = useMemo(() => {
    return {
      labels: data?.chart?.map((item) => item.date) || [],
      datasets: [
        {
          label: "Requests",
          data: data?.chart?.map((item) => item.requests) || [],
          borderColor: "#2563eb",
          backgroundColor: "#2563eb",
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [data]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 10,
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#0f172a",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: "#475569",
          font: {
            size: 11,
            weight: "600",
          },
          maxRotation: 0,
        },
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Requests",
          color: "#0f172a",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          precision: 0,
          color: "#475569",
          font: {
            size: 12,
            weight: "600",
          },
        },
        grid: {
          color: "#e2e8f0",
        },
      },
    },
  };

  const cards = [
    {
      title: "Total Requests",
      value: data?.cards?.total_requests || 0,
      subtitle: "100.00% of all calls",
      icon: <PhoneCall size={20} />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Average Per Day",
      value: data?.cards?.daily_average || 0,
      subtitle: "Requests per day",
      icon: <Clock size={20} />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Highest Day",
      value: data?.cards?.highest_day?.date || "No data",
      subtitle: `${data?.cards?.highest_day?.requests || 0} requests`,
      icon: <TrendingUp size={20} />,
      bg: "bg-green-50",
      border: "border-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Lowest Day",
      value: data?.cards?.lowest_day?.date || "No data",
      subtitle: `${data?.cards?.lowest_day?.requests || 0} requests`,
      icon: <TrendingDown size={20} />,
      bg: "bg-purple-50",
      border: "border-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading monthly analytics...</p>
      </div>
    );
  }

  const summary = data.monthly_summary || {};

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Monthly Requests – Details
            </h1>
            <p className="text-sm text-slate-500">
              Detailed breakdown of monthly requests and daily trends.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr_1fr_1fr]">
          <div className="flex h-full min-h-[48px] items-center gap-2 rounded-xl border border-slate-200 px-4">
            <ListFilter size={18} className="text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Filters</span>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
            >
              {monthNames.slice(1).map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Clinic
            </label>
            <select
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="">All Clinics</option>
              {(data.clinic_options || []).map((clinic) => (
                <option key={clinic} value={clinic}>
                  {clinic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <DetailCard key={card.title} {...card} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
          <h2 className="text-lg font-bold text-slate-900">
            Daily Requests Trend – {monthNames[selectedMonth]} {selectedYear}
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            Daily number of requests during the selected month.
          </p>

          <div className="h-[360px]">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Monthly Summary
          </h2>

          <SummaryRow label="Total Requests" value={summary.total_requests || 0} />
          <SummaryRow label="Average Per Day" value={summary.average_per_day || 0} />
          <SummaryRow
            label="Highest Day"
            value={`${summary.highest_day || "No data"} (${summary.highest_day_requests || 0})`}
          />
          <SummaryRow
            label="Lowest Day"
            value={`${summary.lowest_day || "No data"} (${summary.lowest_day_requests || 0})`}
          />
          <SummaryRow label="Days With Requests" value={summary.days_with_requests || 0} />
          <SummaryRow label="Days With No Requests" value={summary.days_with_no_requests || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-slate-900">
            Daily Breakdown – {monthNames[selectedMonth]} {selectedYear}
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            Date-wise request count and change from previous day.
          </p>

          <div className="max-h-[340px] overflow-y-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="sticky top-0 border-b bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Requests</th>
                  <th className="px-4 py-3">vs Previous Day</th>
                </tr>
              </thead>

              <tbody>
                {(data.daily_breakdown || []).map((row) => (
                  <tr key={row.date} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-slate-700">{row.date}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {row.requests}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        row.percentage > 0
                          ? "text-green-600"
                          : row.percentage < 0
                          ? "text-red-600"
                          : "text-slate-500"
                      }`}
                    >
                      {row.percentage > 0
                        ? `+${row.change} (${row.percentage}%)`
                        : row.percentage < 0
                        ? `${row.change} (${row.percentage}%)`
                        : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-slate-900">
            Requests by Clinic – {monthNames[selectedMonth]} {selectedYear}
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            Clinic-wise request count and percentage contribution.
          </p>

          <div className="max-h-[340px] overflow-y-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead className="sticky top-0 border-b bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Clinic</th>
                  <th className="px-4 py-3">Requests</th>
                  <th className="px-4 py-3">% of Total</th>
                </tr>
              </thead>

              <tbody>
                {(data.requests_by_clinic || []).map((row) => (
                  <tr key={row.clinic_name} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {row.clinic_name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.requests}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {row.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="border-t bg-slate-50 font-bold text-slate-900">
                <tr>
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3">{summary.total_requests || 0}</td>
                  <td className="px-4 py-3">100.00%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  title,
  value,
  subtitle,
  icon,
  bg,
  border,
  iconBg,
  iconColor,
}) {
  return (
    <div
      className={`rounded-2xl border ${border} ${bg} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
    >
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      <p className="text-sm font-semibold text-slate-600">{title}</p>

      <h3 className="mt-1 truncate text-2xl font-bold text-slate-900">
        {value}
      </h3>

      <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
}

export default MonthlyRequestsDetails;