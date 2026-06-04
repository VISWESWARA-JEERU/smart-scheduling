import { forwardRef } from "react";
import { Doughnut } from "react-chartjs-2";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const RequestTypeChart = forwardRef(({ data }, ref) => {
  const filteredData = (data || []).filter(
    (item) => item.total >= 10
  );

  return (
    <div className="h-[600px] w-full rounded-xl bg-white p-5 shadow-card">
      <h2 className="mb-4 text-xl font-semibold text-slate-700">
        Request Types
      </h2>

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

          plugins: {
            legend: {
              position: "right",

              labels: {
                usePointStyle: true,
                pointStyle: "circle",
                padding: 25,

                font: {
                  size: 16,
                  weight: "bold",
                },

                generateLabels: (chart) => {
                  const chartData = chart.data;

                  return chartData.labels.map((label, index) => ({
                    text: `${label} : ${chartData.datasets[0].data[index]}`,

                    fillStyle:
                      chartData.datasets[0].backgroundColor[index],

                    strokeStyle:
                      chartData.datasets[0].backgroundColor[index],

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
                size: 16,
              },

              formatter: (value) => value,
            },
          },
        }}
      />
    </div>
  );
});

export default RequestTypeChart;