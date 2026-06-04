import { forwardRef } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const RequestTypeChart = forwardRef(({ data, title="Request Types" }, ref) => {
  const filteredData = (data || []).filter(
    (item) => item.total >= 10
  );

  return (
    // 1. Fixed width typo to make it responsive (w-full + max-width)
    <div className="w-full max-w-[1000px] rounded-xl bg-white p-5 shadow-card mx-auto">
      <h2 className="mb-1 text-xl font-semibold text-slate-700">
        {title}
      </h2>

      {/* 2. Added a dedicated relative wrapper for Chart.js responsiveness */}
      <div className="relative h-[500px] w-full flex justify-center">
        <Doughnut
          ref={ref}
          data={{
            labels: filteredData.map((item) => item.user_request),
            datasets: [
              {
                label: "Requests",
                data: filteredData.map((item) => item.total),
                backgroundColor: [
                  "#36A2EB",
                  "#FCEC08",
                  "#F50A25",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#FF6384",
                  "#07FFDA",
                  "#26BF35",
                  "#3E4695",
                  "#8B5CF6",
                  "#14B8A6",
                ],
                borderWidth: 1,
              },
            ],
          }}
          plugins={[ChartDataLabels]}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            // 3. Added layout padding to prevent cut-offs at the top/bottom
            layout: {
              padding: 20,
            },
            plugins: {
              legend: {
                position: "right",
                labels: {
                  usePointStyle: true,
                  pointStyle: "circle",
                  padding: 20, // Slightly reduced to keep the legend compact
                  font: {
                    size: 18, // Slightly reduced for better fit on smaller screens
                    weight: "bold",
                  },
                  generateLabels: (chart) => {
                    const chartData = chart.data;
                    return chartData.labels.map((label, index) => ({
                      text: `${label} : ${chartData.datasets[0].data[index]}`,
                      fillStyle: chartData.datasets[0].backgroundColor[index],
                      strokeStyle: chartData.datasets[0].backgroundColor[index],
                      lineWidth: 0,
                      hidden: false,
                      index: index,
                      pointStyle: "circle",
                    }));
                  },
                },
              },
              tooltip: {
                enabled: true,
              },
              datalabels: {
                color: "black",
                font: {
                  weight: "bold",
                  size: 17,
                },
                formatter: (value) => value,
              },
            },
          }}
        />
      </div>
    </div>
  );
});

export default RequestTypeChart;