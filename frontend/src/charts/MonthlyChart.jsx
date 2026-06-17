import { forwardRef } from "react";
import { Bar } from "react-chartjs-2";
import { Calendar1 } from "lucide-react";

import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const MonthlyChart = forwardRef(({ data = [] }, ref) => {
  const maxMonthlyRequests = Math.max(
    ...data.map((item) => Number(item.request_count || 0)),
    0
  );

  const calculateStepSize = (maxValue) => {
    if (maxValue <= 10) return 1;
    if (maxValue <= 50) return 10;
    if (maxValue <= 100) return 20;
    if (maxValue <= 500) return 50;
    if (maxValue <= 1000) return 100;
    if (maxValue <= 5000) return 500;
    if (maxValue <= 10000) return 1000;

    return Math.ceil(maxValue / 5 / 1000) * 1000;
  };

  const stepSize = calculateStepSize(maxMonthlyRequests || 1);

  const suggestedMax =
    Math.ceil((maxMonthlyRequests || stepSize) / stepSize) * stepSize +
    stepSize;

  const monthCount = data.length || 1;

  const tickRotation = monthCount > 8 ? 35 : 0;
  const tickFontSize = monthCount > 8 ? 12 : 14;

  return (
    <div className="h-[550px] w-full">
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
              barPercentage: monthCount >= 10 ? 0.6 : 0.5,
              categoryPercentage: monthCount >= 10 ? 0.75 : 0.6,
              maxBarThickness: monthCount >= 10 ? 55 : 120,
            },
          ],
        }}
        plugins={[ChartDataLabels]}
        options={{
          responsive: true,
          maintainAspectRatio: false,

          layout: {
            padding: {
              top: 24,
              right: 16,
              bottom: monthCount > 8 ? 35 : 10,
              left: 8,
            },
          },

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
              color: "black",
              font: {
                weight: "bold",
                size: 17,
              },
              formatter: (value) => {
                if (value > 0) return value >= 1000 ? `${value / 1000}k` : value;
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
                color: "black",
                padding: {
                  top: 8,
                },
                font: {
                  size: 18,
                  weight: "bold",
                },
              },

              ticks: {
                autoSkip: false,
                maxRotation: tickRotation,
                minRotation: tickRotation,
                color: "black",
                font: {
                  size: 14,
                  weight: "600",
                },
              },

              border: {
                color: "#cbd5e1",
              },
            },

            y: {
              beginAtZero: true,
              suggestedMax,

              grid: {
                color: "#e2e8f0",
                borderDash: [5, 5],
              },

              title: {
                display: true,
                text: "Requests",
                color: "black",
                font: {
                  size: 18,
                  weight: "bold",
                },
              },

              ticks: {
                stepSize,
                color: "black",
                precision: 0,
                font: {
                  size: 15,
                  // weight:"bold"
                },
                callback: (value) => {
                  if (value >= 1000) return `${value / 1000}k`;
                  return value;
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
  );
});

export default MonthlyChart;