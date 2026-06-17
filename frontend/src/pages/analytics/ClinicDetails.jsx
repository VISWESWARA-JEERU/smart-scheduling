// import { useEffect, useRef, useState } from 'react';
// import { Building2, Download, Filter } from 'lucide-react';
// import ClinicChart from '../../charts/ClinicChart';
// import API from '../../services/api';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// const ClinicAnalytics = () => {
//   const [clinicData, setClinicData] = useState([]);
//   const [selectedClinic, setSelectedClinic] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const chartRef = useRef(null);

//   const currentDate = new Date();
//   const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

//   useEffect(() => {
//     fetchClinicData();
//   }, [selectedMonth, selectedYear, selectedClinic]);

//   const fetchClinicData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await API.get('/clinic-requests', {
//         params: {
//           month: selectedMonth || undefined,
//           year: selectedYear || undefined,
//         },
//       });
//       setClinicData(response.data);
//     } catch (error) {
//       console.error('Error fetching clinic data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const exportChartPDF = async () => {
//     if (!chartRef.current) return;

//     try {
//       const canvas = await html2canvas(chartRef.current);
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();

//       pdf.setFillColor(248, 250, 252);
//       pdf.rect(0, 0, pageWidth, pageHeight, 'F');

//       pdf.setFont('helvetica', 'b');
//       pdf.setFontSize(16);
//       pdf.text('Clinic Analytics Report', 10, 15);

//       pdf.setFont('helvetica', 'normal');
//       pdf.setFontSize(10);
//       pdf.text(
//         `Generated on ${new Date().toLocaleDateString()}`,
//         10,
//         23
//       );

//       const imgWidth = pageWidth - 20;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
//       pdf.save('clinic-analytics.pdf');
//     } catch (error) {
//       console.error('Error exporting PDF:', error);
//     }
//   };

//   const monthNames = [
//     '',
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];

//   const uniqueClinics = [...new Set(clinicData.map((item) => item.clinic_name))];

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
//             <div className="rounded-lg bg-blue-600 p-2">
//               <Building2 size={28} className="text-white" />
//             </div>
//             Clinic Analytics
//           </h1>
//           <p className="mt-2 text-slate-600">
//             Analyze request patterns across clinics
//           </p>
//         </div>
//         <button
//           onClick={exportChartPDF}
//           className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
//         >
//           <Download size={20} />
//           Export PDF
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="flex items-center gap-3 mb-4">
//           <Filter size={20} className="text-slate-600" />
//           <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
//         </div>
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Month
//             </label>
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(Number(e.target.value))}
//               className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {monthNames.map((month, index) => (
//                 <option key={index} value={index}>
//                   {month || 'All Months'}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Year
//             </label>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(Number(e.target.value))}
//               className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {[2022, 2023, 2024, 2025, 2026].map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Clinic
//             </label>
//             <select
//               value={selectedClinic}
//               onChange={(e) => setSelectedClinic(e.target.value)}
//               className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Clinics</option>
//               {uniqueClinics.map((clinic) => (
//                 <option key={clinic} value={clinic}>
//                   {clinic}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Chart */}
//       <div
//         ref={chartRef}
//         className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
//       >
//         {isLoading ? (
//           <div className="flex h-96 items-center justify-center">
//             <div className="text-center">
//               <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
//               <p className="mt-4 text-slate-600">Loading clinic data...</p>
//             </div>
//           </div>
//         ) : (
//           <ClinicChart
//             data={clinicData}
//             title="Clinic Requests"
//             selectedClinic={selectedClinic}
//           />
//         )}
//       </div>

//       {/* Stats Card */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="text-sm font-medium text-slate-600">Total Clinics</p>
//           <p className="mt-2 text-3xl font-bold text-slate-900">
//             {clinicData.length}
//           </p>
//         </div>
//         <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="text-sm font-medium text-slate-600">
//             Total Requests
//           </p>
//           <p className="mt-2 text-3xl font-bold text-slate-900">
//             {clinicData.reduce(
//               (sum, item) => sum + (Number(item.total_requests) || 0),
//               0
//             )}
//           </p>
//         </div>
//         <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <p className="text-sm font-medium text-slate-600">
//             Average per Clinic
//           </p>
//           <p className="mt-2 text-3xl font-bold text-slate-900">
//             {clinicData.length > 0
//               ? Math.round(
//                   clinicData.reduce(
//                     (sum, item) => sum + (Number(item.total_requests) || 0),
//                     0
//                   ) / clinicData.length
//                 )
//               : 0}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClinicAnalytics;

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Building2, Trophy, Users, TrendingDown } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";


Chart.register(ChartDataLabels);

function ClinicDetails() {
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
        fetchClinicDetails();
    }, [selectedMonth, selectedYear]);

    const fetchClinicDetails = async () => {
        try {
            setLoading(true);

            const res = await API.get("/analytics/clinic", {
                params: {
                    month: selectedMonth,
                    year: selectedYear,
                },
            });

            setData(res.data);
        } catch (error) {
            console.error("Clinic Details API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const barData = useMemo(() => {
        return {
            labels: data?.clinic_chart?.map((item) => item.clinic_name) || [],
            datasets: [
                {
                    label: "Requests",
                    data: data?.clinic_chart?.map((item) => item.requests) || [],
                    backgroundColor: [
                        "#f97316",
                        "#2563eb",
                        "#22c55e",
                        "#ec4899",
                        "#8b5cf6",
                        "#14b8a6",
                    ],
                    borderRadius: 8,
                    maxBarThickness: 70,

                },
            ],
        };
    }, [data]);

    const doughnutData = useMemo(() => {
        return {
            labels: data?.share_chart?.map((item) => item.clinic_name) || [],
            datasets: [
                {
                    data: data?.share_chart?.map((item) => item.percentage) || [],
                    backgroundColor: [
                        "#f97316",
                        "#2563eb",
                        "#22c55e",
                        "#ec4899",
                        "#4810cd",
                        "#14b814",
                        "#34b7a3",
                        "#b4e20e",
                        "#f41af4"
                    ],
                    borderWidth: 3,
                    borderColor: "#ffffff",
                    hoverOffset: 8,
                },
            ],
        };
    }, [data]);

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#0f172a",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
                padding: 12,
                cornerRadius: 10,

            },
            datalabels: {
                anchor: "end",
                align: "top",
                color: "#0f172a",
                font: {
                    size: 14,
                    weight: "bold",
                },
                formatter: (value) => value,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Clinic Name",
                    color: "#0f172a",
                    font: { size: 14, weight: "bold" },
                },
                ticks: {
                    color: "#334155",
                    font: { size: 11, weight: "600" },
                    maxRotation: 25,
                    minRotation: 0,
                },
                grid: { display: false },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Requests",
                    color: "#0f172a",
                    font: { size: 14, weight: "bold" },
                },
                ticks: {
                    precision: 0,
                    color: "#334155",
                    font: { size: 12, weight: "600" },
                },
                grid: { color: "#e2e8f0" },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
            datalabels: {
                color: "#ffffff",
                font: {
                    weight: "bold",
                    size: 12,
                },

                // formatter: (value) => `${value}%`,
                display: false,
            },
            legend: {
                position: "right",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 10,
                    padding: 18,

                    generateLabels: (chart) => {
                        const dataset = chart.data.datasets[0];

                        return chart.data.labels.map((label, index) => {
                            const percentage =
                                data?.share_chart?.[index]?.percentage ?? 0;

                            return {
                                text: `${label} (${percentage}%)`,
                                fillStyle: dataset.backgroundColor[index],
                                strokeStyle: dataset.backgroundColor[index],
                                lineWidth: 0,
                                hidden: false,
                                index,
                            };
                        });
                    },
                },
            },
            tooltip: {
                backgroundColor: "#0f172a",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
                padding: 12,
                cornerRadius: 10,
                // callbacks: {
                //     label: function (context) {
                //         const item = data?.share_chart?.[context.dataIndex];

                //         return `${item?.clinic_name}: ${item?.percentage}%`;
                //     },
                // },
            },
        },
    };

    const cards = [
        {
            title: "Total Requests",
            value: data?.cards?.total_requests || 0,
            subtitle: "100.00% of all calls",
            icon: <Building2 size={20} />,
            bg: "bg-blue-50",
            border: "border-blue-100",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Top Clinic",
            value: data?.cards?.top_clinic?.clinic_name || "No data",
            subtitle: `${data?.cards?.top_clinic?.requests || 0} requests`,
            icon: <Trophy size={20} />,
            bg: "bg-green-50",
            border: "border-green-100",
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            title: "Lowest Clinic",
            value: data?.cards?.lowest_clinic?.clinic_name || "No data",
            subtitle: `${data?.cards?.lowest_clinic?.requests || 0} requests`,
            icon: <TrendingDown size={20} />,
            bg: "bg-purple-50",
            border: "border-purple-100",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            title: "Clinics",
            value: data?.cards?.total_clinics || 0,
            subtitle: "Active clinics",
            icon: <Users size={20} />,
            bg: "bg-amber-50",
            border: "border-amber-100",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
    ];

    if (loading || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-600">Loading clinic analytics...</p>
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
                            Clinic Requests – Details
                        </h1>
                        <p className="text-sm text-slate-500">
                            Detailed breakdown of AI voice agent requests by clinic.
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <DetailCard key={card.title} {...card} />
                ))}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">
                        Requests by Clinic
                    </h2>
                    <p className="mb-4 text-sm text-slate-500">
                        Total number of requests received by each clinic.
                    </p>

                    <div className="h-[340px]">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">
                        Share of Requests
                    </h2>
                    <p className="mb-4 text-sm text-slate-500">
                        Percentage distribution of requests by clinic.
                    </p>

                    <div className="h-[340px]">
                        <Doughnut
                            data={doughnutData}
                            options={doughnutOptions}
                            plugins={[ChartDataLabels]}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-bold text-slate-900">
                    Clinic-wise Overview
                </h2>
                <p className="mb-4 text-sm text-slate-500">
                    Detailed metric and request share for each clinic.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left text-sm">
                        <thead className="border-b bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Clinic Name</th>
                                <th className="px-4 py-3">Total Requests</th>
                                <th className="px-4 py-3">% of Total</th>
                                <th className="px-4 py-3">Top Request Type</th>
                                <th className="px-4 py-3">Completed</th>
                                <th className="px-4 py-3">Blocked</th>
                                <th className="px-4 py-3">Avg. Duration</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(data.overview || []).map((row, index) => (
                                <tr key={row.clinic_name} className="border-b last:border-b-0">
                                    <td className="px-4 py-3 text-slate-600">{index + 1}</td>

                                    <td className="px-4 py-3 font-semibold text-slate-900">
                                        {row.clinic_name}
                                    </td>

                                    <td className="px-4 py-3 text-slate-700">
                                        {row.total_requests}
                                    </td>

                                    <td className="px-4 py-3 font-semibold text-slate-900">
                                        {row.percentage}%
                                    </td>

                                    <td className="px-4 py-3 text-slate-700">
                                        {row.top_request_type}
                                    </td>

                                    <td className="px-4 py-3 text-green-600 font-semibold">
                                        {row.completed}
                                    </td>

                                    <td className="px-4 py-3 text-red-600 font-semibold">
                                        {row.blocked}
                                    </td>

                                    <td className="px-4 py-3 text-slate-700">
                                        {row.avg_duration}
                                    </td>
                                </tr>
                            ))}

                            {(data.overview || []).length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                                        No clinic data available for selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        <tfoot className="border-t bg-slate-50 font-bold text-slate-900">
                            <tr>
                                <td className="px-4 py-3" colSpan="2">
                                    Total
                                </td>
                                <td className="px-4 py-3">
                                    {data?.cards?.total_requests || 0}
                                </td>
                                <td className="px-4 py-3">100.00%</td>
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

            <p className="text-sm font-semibold text-slate-600">{title}</p>

            <h3 className="mt-1 truncate text-2xl font-bold text-slate-900">
                {value}
            </h3>

            <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>
        </div>
    );
}

export default ClinicDetails;

