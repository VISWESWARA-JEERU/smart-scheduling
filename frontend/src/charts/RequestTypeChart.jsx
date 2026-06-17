// import { forwardRef } from "react";
// import { Doughnut } from "react-chartjs-2";
// import { Donut } from "lucide-react";

// import "chart.js/auto";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { Chart } from "chart.js";

// Chart.register(ChartDataLabels);

// const COLORS = [
//   "#2563EB",
//   "#22C55E",
//   "#F97316",
//   "#EC4899",
//   "#8B5CF6",
//   "#14B8A6",
//   "#EF4444",
//   "#EAB308",
//   "#06B6D4",
//   "#A855F7",
//   "#84CC16",
//   "#F43F5E",
//   "#0EA5E9",
//   "#F59E0B",
//   "#10B981",
// ];

// const RequestTypeChart = forwardRef(
//   ({ data = [], title = "Request Types" }, ref) => {
//     const filteredData = data.filter((item) => Number(item.total || 0) >= 10);

//     const totalRequests = filteredData.reduce(
//       (sum, item) => sum + Number(item.total || 0),
//       0
//     );

//     const getPercentage = (value) => {
//       if (!totalRequests) return "0.00";
//       return ((Number(value) / totalRequests) * 100).toFixed(2);
//     };

//     return (
//       <div className="h-[360px] w-full">
//         {title && (
//           <div className="mb-4 flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
//               <Donut size={26} className="text-purple-600" strokeWidth={2} />
//             </div>

//             <h2 className="text-lg font-bold text-slate-900">{title}</h2>
//           </div>
//         )}

//         <div className="grid h-[300px] grid-cols-1 gap-5 lg:grid-cols-[45%_55%]">
//           {/* Doughnut */}
//           <div className="relative flex h-full items-center justify-center">
//             <Doughnut
//               ref={ref}
//               data={{
//                 labels: filteredData.map((item) => item.user_request),
//                 datasets: [
//                   {
//                     label: "Requests",
//                     data: filteredData.map((item) => item.total),
//                     backgroundColor: filteredData.map(
//                       (_, index) => COLORS[index % COLORS.length]
//                     ),
//                     borderColor: "#ffffff",
//                     borderWidth: 3,
//                     hoverOffset: 8,
//                   },
//                 ],
//               }}
//               plugins={[ChartDataLabels]}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 cutout: "58%",

//                 layout: {
//                   padding: 8,
//                 },

//                 plugins: {
//                   legend: {
//                     display: false,
//                   },

//                   tooltip: {
//                     enabled: true,
//                     backgroundColor: "#0f172a",
//                     titleColor: "#ffffff",
//                     bodyColor: "#ffffff",
//                     padding: 12,
//                     cornerRadius: 10,
//                     callbacks: {
//                       label: (context) => {
//                         const value = context.raw || 0;
//                         return `${context.label}: ${value} (${getPercentage(
//                           value
//                         )}%)`;
//                       },
//                     },
//                   },

//                   datalabels: {
//                     color: "#ffffff",
//                     font: {
//                       weight: "bold",
//                       size: 13,
//                     },
//                     formatter: (value) => {
//                       if (!value) return "";
//                       return value;
//                     },
//                   },
//                 },
//               }}
//             />

//             <div className="pointer-events-none absolute text-center">
//               <p className="text-2xl font-bold text-slate-900">
//                 {totalRequests}
//               </p>
//               <p className="text-xs font-semibold text-slate-500">Total</p>
//             </div>
//           </div>

//           {/* Custom Legend */}
//           <div className="h-full overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/70 p-4">
//             <div className="space-y-3">
//               {filteredData.map((item, index) => (
//                 <div
//                   key={item.user_request}
//                   className="grid grid-cols-[16px_1fr_auto_auto] items-start gap-3 rounded-lg bg-white px-3 py-2 shadow-sm"
//                 >
//                   <span
//                     className="mt-1 h-3 w-3 rounded-full"
//                     style={{
//                       backgroundColor: COLORS[index % COLORS.length],
//                     }}
//                   />

//                   <p className="text-sm font-semibold leading-5 text-slate-700">
//                     {item.user_request}
//                   </p>

//                   <p className="text-sm font-bold text-slate-900">
//                     {item.total}
//                   </p>

//                   <p className="min-w-[64px] text-right text-sm font-medium text-slate-500">
//                     {getPercentage(item.total)}%
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// export default RequestTypeChart;


import { forwardRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Donut } from "lucide-react";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const COLORS = [
  "#2563EB",
  "#22C55E",
  "#F97316",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
  "#EF4444",
  "#EAB308",
  "#06B6D4",
  "#A855F7",
  "#84CC16",
  "#F43F5E",
  "#0EA5E9",
  "#F59E0B",
  "#10B981",
];

const RequestTypeChart = forwardRef(
  ({ data = [], title = "Request Types" }, ref) => {
    const filteredData = data.filter((item) => Number(item.total || 0) >= 10);

    const totalRequests = filteredData.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );

    const isLargeLegend = filteredData.length > 10;

    const getPercentage = (value) => {
      if (!totalRequests) return "0.00";
      return ((Number(value) / totalRequests) * 100).toFixed(2);
    };

    return (
      <div className={isLargeLegend ? "h-[500px] w-full" : "h-[420px] w-full"}>
        {title && (
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Donut size={26} className="text-purple-600" strokeWidth={2} />
            </div>

            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          </div>
        )}

        <div className={title ? "relative h-[360px] w-full" : "relative h-full w-full"}>
          <Doughnut
            ref={ref}
            data={{
              labels: filteredData.map((item) => item.user_request),
              datasets: [
                {
                  label: "Requests",
                  data: filteredData.map((item) => item.total),
                  backgroundColor: filteredData.map(
                    (_, index) => COLORS[index % COLORS.length]
                  ),
                  borderColor: "#ffffff",
                  borderWidth: 3,
                  hoverOffset: 8,
                },
              ],
            }}
            plugins={[ChartDataLabels]}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: isLargeLegend ? "65%" : "55%",

              layout: {
                padding: {
                  top: 12,
                  right: isLargeLegend ? 8 : 16,
                  bottom: 12,
                  left: 3,
                },
              },

              plugins: {
                legend: {
                  display: true,
                  position: "right",
                  align: "center",

                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 12,
                    boxHeight: 12,
                    padding: isLargeLegend ? 10 : 20,

                    font: {
                      size: isLargeLegend ? 16: 18,
                      weight: "600",
                    },

                    generateLabels: (chart) => {
                      const chartData = chart.data;

                      return chartData.labels.map((label, index) => {
                        const value = chartData.datasets[0].data[index];

                        return {
                          text: `${label} (${value})-${getPercentage(value)}%`,
                          fillStyle:
                            chartData.datasets[0].backgroundColor[index],
                          strokeStyle:
                            chartData.datasets[0].backgroundColor[index],
                          lineWidth: 0,
                          hidden: false,
                          index,
                          pointStyle: "circle",
                        };
                      });
                    },
                  },
                },

                tooltip: {
                  enabled: true,
                  backgroundColor: "#0f172a",
                  titleColor: "#ffffff",
                  bodyColor: "#ffffff",
                  padding: 10,
                  cornerRadius: 10,
                  // callbacks: {
                  //   label: (context) => {
                  //     const value = context.raw || 0;
                  //     return `${context.label}: ${value} (${getPercentage(
                  //       value
                  //     )}%)`;
                  //   },
                  // },
                },

                datalabels: {
                  color: "#ffffff",
                  font: {
                    weight: "bold",
                    size: isLargeLegend ? 15: 17,
                  },
                  formatter: (value) => {
                    if (!value) return "";
                    return value;
                  },
                },
              },
            }}
          />

          <div className="pointer-events-none absolute left-[25%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-2xl font-bold text-slate-900">{totalRequests}</p>
            <p className="text-xs font-semibold text-slate-500">Total</p>
          </div>
        </div>
      </div>
    );
  }
);

export default RequestTypeChart;