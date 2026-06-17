import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  ListChecks,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "chart.js/auto";

function RequestTypesDetails() {
  const navigate = useNavigate();
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const colors = [
    "#2563eb",
    "#22c55e",
    "#ec4899",
    "#f97316",
    "#8b5cf6",
    "#14b8a6",
    "#ef4444",
    "#64748b",
    "#f59e0b",
    "#06b6d4",
  ];

  useEffect(() => {
    fetchDetails();
  }, [selectedMonth, selectedYear, selectedRequestType]);

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const res = await API.get("/analytics/request-types", {
        params: {
          month: selectedMonth,
          year: selectedYear,
          request_type: selectedRequestType || undefined,
        },
      });

      setData(res.data);
    } catch (error) {
      console.error("Request Types Details API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const doughnutData = useMemo(() => {
    return {
      labels: data?.request_distribution?.map((item) => item.request_type) || [],
      datasets: [
        {
          data: data?.request_distribution?.map((item) => item.requests) || [],
          backgroundColor: colors,
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverOffset: 8,
        },
      ],
    };
  }, [data]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
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
        callbacks: {
          label: function (context) {
            const item = data?.request_distribution?.[context.dataIndex];
            return `${item?.request_type}: ${item?.requests} requests (${item?.percentage}%)`;
          },
        },
      },
    },
  };

  const cards = [
    {
      title: "Total Request Types",
      value: data?.cards?.total_request_types || 0,
      subtitle: "Unique types",
      icon: <ListChecks size={20} />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Completed Requests",
      value: data?.cards?.completed_requests || 0,
      subtitle: `${data?.cards?.completed_percentage || 0}%`,
      icon: <CheckCircle2 size={20} />,
      bg: "bg-green-50",
      border: "border-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Blocked / Unsuccessful",
      value: data?.cards?.blocked_requests || 0,
      subtitle: `${data?.cards?.blocked_percentage || 0}%`,
      icon: <XCircle size={20} />,
      bg: "bg-red-50",
      border: "border-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Avg. Completion Time",
      value: data?.cards?.avg_completion_time || "00:00",
      subtitle: "mm:ss",
      icon: <Clock size={20} />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading request type analytics...</p>
      </div>
    );
  }

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
              Request Types – Details
            </h1>
            <p className="text-sm text-slate-500">
              Detailed breakdown of request types and performance.
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

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">
            Request Types Distribution
          </h2>

          <p className="mb-4 text-sm text-slate-500">
            Percentage distribution of requests by type.
          </p>

          <div className="relative mx-auto h-[320px] max-w-[420px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />

            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-bold text-slate-900">
                {data?.total_requests || 0}
              </p>
              <p className="text-sm font-semibold text-slate-500">Total</p>
            </div>
          </div>

          <div className="mt-6 max-h-[220px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-3">
              {(data.request_distribution || []).map((item, index) => (
                <div
                  key={item.request_type}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: colors[index % colors.length],
                    }}
                  />

                  <span className="truncate font-semibold text-slate-700">
                    {item.request_type}
                  </span>

                  <span className="ml-auto whitespace-nowrap text-slate-500">
                    {item.requests} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <DetailCard key={card.title} {...card} />
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-bold text-slate-900">
              Request Types Overview
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Detailed metrics for each request type.
            </p>

            <div className="max-h-[360px] overflow-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="sticky top-0 z-10 border-b bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Request Type</th>
                    <th className="px-4 py-3">Total Requests</th>
                    <th className="px-4 py-3">% of Total</th>
                    <th className="px-4 py-3">Completed</th>
                    <th className="px-4 py-3">Blocked</th>
                    <th className="px-4 py-3">Completion Rate</th>
                    <th className="px-4 py-3">Avg. Duration</th>
                  </tr>
                </thead>

                <tbody>
                  {(data.overview || []).map((row, index) => (
                    <tr
                      key={row.request_type}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-3 text-slate-600">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {row.request_type}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {row.total_requests}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {row.percentage}%
                      </td>

                      <td className="px-4 py-3 font-semibold text-green-600">
                        {row.completed}
                      </td>

                      <td className="px-4 py-3 font-semibold text-red-600">
                        {row.blocked}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {row.completion_rate}%
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {row.avg_duration}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="sticky bottom-0 border-t bg-slate-50 font-bold text-slate-900">
                  <tr>
                    <td className="px-4 py-3" colSpan="2">
                      Total
                    </td>
                    <td className="px-4 py-3">{data?.total_requests || 0}</td>
                    <td className="px-4 py-3">100.00%</td>
                    <td className="px-4 py-3">
                      {data?.cards?.completed_requests || 0}
                    </td>
                    <td className="px-4 py-3">
                      {data?.cards?.blocked_requests || 0}
                    </td>
                    <td className="px-4 py-3">
                      {data?.cards?.completed_percentage || 0}%
                    </td>
                    <td className="px-4 py-3">
                      {data?.cards?.avg_completion_time || "00:00"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Requests by Type
              </h2>
              <p className="text-sm text-slate-500">
                Latest calls for the selected request type.
              </p>
            </div>

            <select
              value={selectedRequestType}
              onChange={(e) => setSelectedRequestType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="">All Request Types</option>

              {(data.request_options || []).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="sticky top-0 border-b bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Call ID</th>
                  <th className="px-4 py-3">Clinic</th>
                  <th className="px-4 py-3">Request Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Duration</th>
                </tr>
              </thead>

              <tbody>
                {(data.recent_requests || []).map((row) => (
                  <tr
                    key={`${row.call_id}-${row.time}`}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-3 text-slate-700">{row.time}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {row.call_id}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.clinic}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.request_type}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        row.status === "Completed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {row.status}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.duration}
                    </td>
                  </tr>
                ))}

                {(data.recent_requests || []).length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No recent requests available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Info size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              About Request Types
            </h2>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            This section shows the distribution of different request types
            received by the AI voice agent. It helps understand which requests
            are most common and where improvements are needed.
          </p>

          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li>• Which type of requests are most common</li>
            <li>• Completion rate and performance for each type</li>
            <li>• Where improvements or automation is needed</li>
          </ul>
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

export default RequestTypesDetails;