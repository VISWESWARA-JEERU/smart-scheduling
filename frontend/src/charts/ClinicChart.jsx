// import { forwardRef } from "react";
// import { Bar } from "react-chartjs-2";
// import { ChartColumnBig } from "lucide-react";

// import "chart.js/auto";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { Chart } from "chart.js";

// Chart.register(ChartDataLabels);

// const ClinicChart = forwardRef(
//   ({ data = [], title = "Clinic Requests", selectedClinic }, ref) => {
//     const sortedData = [...data].sort(
//       (a, b) => b.total_requests - a.total_requests
//     );

//     const clinicFilteredData = selectedClinic
//       ? sortedData.filter((item) => item.clinic_name === selectedClinic)
//       : sortedData;

//     const filteredData = clinicFilteredData.filter(
//       (item) => item.total_requests >= 10
//     );

//     const clinicCount = filteredData.length;

//     const maxClinicRequests = Math.max(
//       ...filteredData.map((item) => Number(item.total_requests || 0)),
//       0
//     );

//     const chartWidth =
//       clinicCount <= 1
//         ? "w-[45%]"
//         : clinicCount <= 2
//           ? "w-[60%]"
//           : clinicCount <= 4
//             ? "w-[85%]"
//             : "w-full";

//     const chartHeight =
//       clinicCount <= 2 ? "h-[320px]" : "h-[370px]";

//     return (
//       <div className="h-[320px] w-full">
//         {/* <div className="mb-4 flex items-center justify-center gap-2">
//           <ChartColumnBig
//             size={28}
//             className="text-blue-600"
//             strokeWidth={2}
//             color="black"
//           />

//           <h2 className="text-lg font-bold text-slate-900">{title}</h2>
//         </div> */}

//         <div className="flex h-full w-full justify-center">
//           <div className={`${chartHeight} ${chartWidth}`}>
//             <Bar
//               ref={ref}
//               data={{
//                 labels: filteredData.map((item) => item.clinic_name),

//                 datasets: [
//                   {
//                     label: "Total Requests",
//                     data: filteredData.map((item) => item.total_requests),

//                     backgroundColor: [
//                       "rgba(249, 115, 22, 0.85)",
//                       "rgba(37, 99, 235, 0.85)",
//                       "rgba(34, 197, 94, 0.85)",
//                       "rgba(236, 72, 153, 0.85)",
//                       "rgba(239, 68, 68, 0.85)",
//                     ],

//                     borderWidth: 0,
//                     borderRadius: 8,

//                     barPercentage: clinicCount <= 1 ? 0.45 : 0.7,
//                     categoryPercentage: clinicCount <= 1 ? 0.6 : 0.8,
//                     maxBarThickness:
//                       clinicCount <= 1 ? 90 : clinicCount <= 3 ? 110 : 120,
//                   },
//                 ],
//               }}
//               plugins={[ChartDataLabels]}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,

//                 plugins: {
//                   legend: {
//                     display: false,
//                   },

//                   title: {
//                     display: false,
//                   },

//                   datalabels: {
//                     anchor: "end",
//                     align: "top",
//                     offset: 4,
//                     color: "#020617",
//                     font: {
//                       weight: "bold",
//                       size: 14,
//                     },
//                     formatter: (value) => value,
//                   },

//                   tooltip: {
//                     enabled: true,
//                     backgroundColor: "#0f172a",
//                     titleColor: "#ffffff",
//                     bodyColor: "#ffffff",
//                     padding: 12,
//                     cornerRadius: 10,
//                   },
//                 },

//                 scales: {
//                   x: {
//                     grid: {
//                       display: false,
//                     },

//                     title: {
//                       display: true,
//                       text: "Clinics",
//                       color: "#334155",
//                       font: {
//                         size: 15,
//                         weight: "bold",
//                       },
//                     },

//                     ticks: {
//                       autoSkip: false,
//                       maxRotation: clinicCount > 4 ? 20 : 0,
//                       minRotation: 0,
//                       color: "#334155",
//                       font: {
//                         size: 13,
//                         weight: "600",
//                       },
//                     },

//                     border: {
//                       color: "#cbd5e1",
//                     },
//                   },

//                   y: {
//                     beginAtZero: true,
//                     suggestedMax: maxClinicRequests * 1.15,

//                     grid: {
//                       color: "#e2e8f0",
//                       borderDash: [6, 6],
//                     },

//                     title: {
//                       display: true,
//                       text: "Number of Requests",
//                       color: "#334155",
//                       font: {
//                         size: 15,
//                         weight: "bold",
//                       },
//                     },

//                     ticks: {
//                       color: "#334155",
//                       precision: 0,
//                       font: {
//                         size: 13,
//                       },
//                     },

//                     border: {
//                       color: "#cbd5e1",
//                     },
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// export default ClinicChart;



import { forwardRef } from "react";
import { Bar } from "react-chartjs-2";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const ClinicChart = forwardRef(
  ({ data = [], selectedClinic }, ref) => {
    const sortedData = [...data].sort(
      (a, b) => b.total_requests - a.total_requests
    );

    const clinicFilteredData = selectedClinic ? sortedData.filter((item) => item.clinic_name === selectedClinic) : sortedData;

    const filteredData = clinicFilteredData.filter( (item) => item.total_requests >= 10);

    const clinicCount = filteredData.length || 1;

    const maxClinicRequests = Math.max(...filteredData.map((item) => Number(item.total_requests || 0)),0);

    // const rotation =
    //   clinicCount <= 2 ? 0 : clinicCount <= 4 ? 8: clinicCount <= 6 ? 45 : 60;

    const tickFontSize =
      clinicCount <= 4 ? 14 : clinicCount <= 6 ? 12 : 11;

    const chartWidth =
      clinicCount <= 1
        ? "w-[70%]"
        : clinicCount <= 2
        ? "w-[85%]"
        : "w-full";

    return (
      <div className="h-[550px] w-full">
        <div className={`h-full ${chartWidth} mx-auto`}>
          <Bar
            ref={ref}
            data={{
              labels: filteredData.map((item) => item.clinic_name),
              datasets: [
                {
                  label: "Total Requests",
                  data: filteredData.map((item) => item.total_requests),
                  backgroundColor: [
                    "rgba(249, 115, 22, 0.85)",
                    "rgba(37, 99, 235, 0.85)",
                    "rgba(34, 197, 94, 0.85)",
                    "rgba(236, 72, 153, 0.85)",
                    "rgba(239, 68, 68, 0.85)",
                  ],
                  borderWidth: 0,
                  borderRadius: 8,
                  barPercentage: clinicCount <= 1 ? 0.45 : 0.65,
                  categoryPercentage: clinicCount <= 1 ? 0.6 : 0.75,
                  maxBarThickness: clinicCount <= 1 ? 90 : 110,
                },
              ],
            }}
            plugins={[ChartDataLabels]}
            options={{
              responsive: true,
              maintainAspectRatio: false,

              layout: {
                padding: {
                  top: 10,
                  right: 8,
                  bottom: clinicCount > 2 ? 30 : 15,
                  left: 0,
                },
              },

              plugins: {
                legend: {
                  display: false,
                },

                title: {
                  display: false,
                },

                datalabels: {
                  anchor: "end",
                  align: "top",
                  offset: 4,
                  color: "black",
                  font: {
                    weight: "bold",
                    size: 17,
                  },
                  formatter: (value) => value,
                },

                tooltip: {
                  enabled: true,
                  backgroundColor: "#0f172a",
                  titleColor: "#ffffff",
                  bodyColor: "#ffffff",
                  padding: 12,
                  cornerRadius: 10,
                },
              },

              scales: {
                x: {
                  offset: true,

                  grid: {
                    display: false,
                  },

                  title: {
                    display: true,
                    text: "Clinics",
                    color: "black",
                    padding: {
                      top: clinicCount > 2 ? 16 : 8,
                    },
                    font: {
                      size: 18,
                      weight: "bold",
                    },
                  },

                  ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 0,
                    color: "black",
                    padding: 8,
                    font: {
                      size: tickFontSize,
                      weight: "600",
                    },
                    // callback: function (value) {
                    //   const label = this.getLabelForValue(value);

                    //   if (clinicCount <= 3) return label;

                    //   return label.length > 16
                    //     ? label.slice(0, 16) + "..."
                    //     : label;
                    // },
                  },

                  border: {
                    color: "#cbd5e1",
                  },
                },

                y: {
                  beginAtZero: true,
                  suggestedMax: maxClinicRequests * 1.2,

                  grid: {
                    color: "#e2e8f0",
                    borderDash: [6, 6],
                  },

                  title: {
                    display: true,
                    text: "Number of Requests",
                    color: "#334155",
                    font: {
                      size: 18,
                      weight: "bold",
                    },
                  },

                  ticks: {
                    color: "black",
                    precision: 0,
                    font: {
                      size: 17,
                    },
                  },

                  border: {
                    color: "#cbd5e1",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    );
  }
);

export default ClinicChart;