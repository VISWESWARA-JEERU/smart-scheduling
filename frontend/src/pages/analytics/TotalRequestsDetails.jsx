import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Download,
    PhoneCall,
    Clock,
    TrendingUp,
    TrendingDown,
    CalendarDays,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "chart.js/auto";

function TotalRequestsDetails() {
    const navigate = useNavigate();
    const currentDate = new Date();

    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
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
        fetchDetails();
    }, [selectedMonth, selectedYear]);

    const fetchDetails = async () => {
        try {
            setLoading(true);

            const res = await API.get("/analytics/total-requests", {
                params: {
                    month: selectedMonth,
                    year: selectedYear,
                },
            });

            console.log("Total Requests Details:", res.data);
            setData(res.data);
        } catch (error) {
            console.error("Total Requests API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = useMemo(() => {
        return {
            labels: data?.chart?.map((item) => item.date) || [],
            datasets: [
                {
                    label: "Requests",
                    data: data?.chart?.map((item) => item.requests) || [],
                    borderColor: "#2563eb",
                    backgroundColor: "#2563eb",
                    tension: 0.35,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 3,
                },
            ],
        };
    }, [data]);

    const chartOptions = {
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
                        size: 12,
                        weight: "600",
                    },
                },
                grid: {
                    display: false,
                },
            },

            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Number of Requests",
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

    if (loading || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-600">Loading analytics...</p>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Requests",
            value: data.cards?.total_requests || 0,
            subtitle: "100.00% of all calls",
            icon: <PhoneCall size={20} />,
            bg: "bg-blue-50",
            border: "border-blue-100",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Daily Average",
            value: data.cards?.daily_average || 0,
            subtitle: "Requests per day",
            icon: <Clock size={20} />,
            bg: "bg-amber-50",
            border: "border-amber-100",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            title: "Highest Day",
            value: data.cards?.highest_day?.requests || 0,
            subtitle: data.cards?.highest_day?.date || "No data",
            icon: <TrendingUp size={20} />,
            bg: "bg-green-50",
            border: "border-green-100",
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Lowest Day",
            value: data.cards?.lowest_day?.requests || 0,
            subtitle: data.cards?.lowest_day?.date || "No data",
            icon: <TrendingDown size={20} />,
            bg: "bg-purple-50",
            border: "border-purple-100",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];

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
                            Total Requests – Details
                        </h1>
                        <p className="text-sm text-slate-500">
                            Overview of all AI voice agent requests received.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none"
                    >
                        {monthNames.slice(1).map((month, index) => (
                            <option key={month} value={index + 1}>
                                {month}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none"
                    >
                        {[2024, 2025, 2026].map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
                    >
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <DetailCard key={card.title} {...card} />
                ))}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-900">
                            Requests Over Time
                        </h2>
                        <p className="text-sm text-slate-500">
                            Daily trend of AI voice agent requests for{" "}
                            {monthNames[selectedMonth]} {selectedYear}.
                        </p>
                    </div>

                    <div className="h-[360px]">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Summary</h3>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        This metric represents the total number of requests handled by the
                        AI voice agent during the selected month and year.
                    </p>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        It helps track request volume, peak usage days, low activity days,
                        and daily engagement trends.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <CalendarDays size={20} className="text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-900">
                        Daily Breakdown
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="border-b bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Requests</th>
                                <th className="px-4 py-3">Change</th>
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
                                        className={`px-4 py-3 font-semibold ${row.change > 0
                                                ? "text-green-600"
                                                : row.change < 0
                                                    ? "text-red-600"
                                                    : "text-slate-500"
                                            }`}
                                    >
                                        {row.change > 0 ? `+${row.change}` : row.change}
                                    </td>

                                    <td
                                        className={`px-4 py-3 font-semibold ${row.percentage > 0
                                                ? "text-green-600"
                                                : row.percentage < 0
                                                    ? "text-red-600"
                                                    : "text-slate-500"
                                            }`}
                                    >
                                        {row.percentage > 0
                                            ? `↑ ${row.percentage}%`
                                            : row.percentage < 0
                                                ? `↓ ${Math.abs(row.percentage)}%`
                                                : "0%"}
                                    </td>
                                </tr>
                            ))}

                            {(data.daily_breakdown || []).length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-4 py-8 text-center text-slate-500"
                                    >
                                        No data available for the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        <tfoot className="border-t bg-slate-50 font-bold text-slate-900">
                            <tr>
                                <td className="px-4 py-3">Total</td>
                                <td className="px-4 py-3">
                                    {data.cards?.total_requests || 0}
                                </td>
                                <td className="px-4 py-3">-</td>
                                <td className="px-4 py-3">-</td>
                            </tr>
                        </tfoot>
                    </table>
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

      <p className="text-sm font-semibold text-slate-600">
        {title}
      </p>

      <h3 className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </h3>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

export default TotalRequestsDetails;