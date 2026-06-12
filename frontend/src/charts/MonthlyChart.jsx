import { forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import { Calendar1 } from "lucide-react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const MonthlyChart = forwardRef(({ data = [] }, ref) => {
  const maxMonthlyRequests = Math.max(...data.map((item) => Number(item.request_count || 0)), 0);
  return (
    <div className="h-[460px] w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Calendar1 size={35} color="black" strokeWidth={2.25} absoluteStrokeWidth />
        </div>

        <h2 className="text-lg font-bold text-slate-900">
          Monthly Requests
        </h2>
      </div>

      <div className="h-[370px] w-full">
        <Bar
          ref={ref}
          data={{
            labels: data.map((item) => item.month_name),

            datasets: [
              {
                label: "Requests",

                data: data.map((item) => item.request_count),

                backgroundColor: "#2563EB",

                hoverBackgroundColor: "#1D4ED8",

                borderRadius: 8,

                // barThickness: 40,

                maxBarThickness: 170,
              },
            ],
          }}
          plugins={[ChartDataLabels]}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                display: false,
              },

              title: {
                display: false,
              },

              tooltip: {
                enabled: true,
                backgroundColor: "#0f172a",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
                padding: 12,
                cornerRadius: 10,
              },

              datalabels: {
                anchor: "end",
                align: "top",
                offset: 4,

                color: "#0f172a",

                font: {
                  weight: "bold",
                  size: 17,
                },

                formatter: (value) => {
                  if (value > 0) return value;
                  return "";
                },
              },
            },

            scales: {
              x: {
                grid: {
                  display: false,
                },

                title: {
                  display: true,
                  text: "Months",
                  color: "#334155",

                  font: {
                    size: 17,
                    weight: "bold",
                  },
                },

                ticks: {
                  color: "#334155",

                  font: {
                    size: 17,
                    weight: "600",
                  },
                },

                border: {
                  color: "#cbd5e1",
                },
              },

              y: {
                beginAtZero: true,

                grid: {
                  color: "#e2e8f0",
                  borderDash: [5, 5],
                },

                title: {
                  display: true,
                  text: "Requests",
                  color: "#334155",

                  font: {
                    size: 17,
                    weight: "bold",
                  },
                },

               suggestedMax: maxMonthlyRequests * 1.15,

                ticks: {
                  color: "#334155",
                  precision: 0,
                  font: {
                    size: 14,
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
});

export default MonthlyChart;