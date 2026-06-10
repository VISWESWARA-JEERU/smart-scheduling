import { forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const MonthlyChart = forwardRef(({ data }, ref) => {
  return (
    <div className="w-full h-[580px] rounded-xl bg-white p-6 shadow-cardtransition-transform hover:-translate-y-3 shadow-lg hover:border border-slate-300 ">
      <Bar
        ref={ref}
        data={{
          labels: data.map((item) => item.month_name),

          datasets: [
            {
              label: "Requests",
              data: data.map((item) => item.request_count),
              backgroundColor: "rgba(7, 76, 237, 0.6)",
              hoverBackgroundColor: "rgba(239, 32, 32, 0.8)",
              borderRadius: 5,
            },
          ],
        }}
        plugins={[ChartDataLabels]}
        options={{
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: true,
            },

            title: {
              display: true,
              text: "Monthly Requests",
              font: {
                size: 18,
                weight: "bold",
              },
            },

            tooltip: {
              enabled: true,
            },

            datalabels: {
              anchor: "end",
              align: "top",
              color: "black",
              font: {
                weight: "bold",
                size: 18,
              },
              formatter: (value) => {
                if (value > 10) {
                  return value;
                }
                return "";
              },
            },
          },

          scales: {
            x: {
              title: {
                display: true,
                text: "Months",
                color: "black",
                font: {
                  size: 18,
                  weight: "bold",
                },
              },
              ticks: {
                autoSkip: false,
                maxRotation: 30,
                minRotation: 0,
                color: "black",
                font: {
                  size: 18,
                  weight: "bold",
                },
              },
            },

            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Requests",
                color: "black",
                font: {
                  size: 18,
                  weight: "bold",
                },
              },
              ticks: {
                autoSkip: false,
                stepSize: 500,
                color: "black",
                font: {
                  size: 18,
                },
              },
            },
          },
        }}
      />
    </div>
  );
});

export default MonthlyChart;