import { forwardRef } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Donut
} from "lucide-react";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const RequestTypeChart = forwardRef(
  ({ data = [], title = "Request Types" }, ref) => {
    const filteredData = data.filter((item) => item.total >= 10);

    return (
      <div className="h-[430] w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
           <Donut size={36} color="black" strokeWidth={2.25} absoluteStrokeWidth />
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>
        </div>

        <div className="relative h-[340px] w-full">
          <Doughnut
            ref={ref}
            data={{
              labels: filteredData.map((item) => item.user_request),

              datasets: [
                {
                  label: "Requests",
                  data: filteredData.map((item) => item.total),
                  backgroundColor: [
                    "#1058f4",
                    "#1ceb68",
                    "#F97316",
                    "#fe188b",
                    "#6122f3",
                    "#14B8A6",
                    "#f01818",
                    "#EAB308",
                    "#06B6D4",
                    "#997a1e",
                  ],
                  borderColor: "#ffffff",
                  // borderWidth: 4,
                  hoverOffset: 8,
                },
              ],
            }}
            plugins={[ChartDataLabels]}
            options={{
              responsive: true,
              maintainAspectRatio: false,

              // cutout: "65%",

              layout: {
                // padding: 10,
              },

              plugins: {
                legend: {
                  position: "right",
                  labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 16,
                    // boxWidth: 10,
                    // boxHeight: 10,
                   
                    font: {
                      size: 13,
                      weight: "600",
          
                    },

                    generateLabels: (chart) => {
                      const chartData = chart.data;

                      return chartData.labels.map((label, index) => ({
                        text: `${label}: ${chartData.datasets[0].data[index]}`,
                        fillStyle:
                          chartData.datasets[0].backgroundColor[index],
                        strokeStyle:
                          chartData.datasets[0].backgroundColor[index],
                        lineWidth: 1,
                        hidden: false,
                        index,
                        pointStyle: "circle",
                      }));
                    },
                  },
                },

                tooltip: {
                  enabled: true,
                  backgroundColor: "#0f172a",
                  titleColor: "#ffffff",
                  bodyColor: "#ffffff",
                  padding: 12,
                  // cornerRadius: 10,
                },

                datalabels: {
                  color: "#0f172a",
                  font: {
                    weight: "bold",
                    size: 16,
                  },
                  formatter: (value) => value,
                },
              },
            }}
          />
        </div>
      </div>
    );
  }
);

export default RequestTypeChart;