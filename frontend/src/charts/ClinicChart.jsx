import { forwardRef } from "react";
import { Bar } from "react-chartjs-2";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const ClinicChart = forwardRef(({ data, title = "Clinic Requests" ,selectedClinic}, ref) => {
  const sortedData = [...(data || [])].sort(
    (a, b) => b.total_requests - a.total_requests
  );
  
  const ClinicFilteredData = selectedClinic ? sortedData.filter(
    (item) => item.clinic_name === selectedClinic) : sortedData;

  const filteredData = ClinicFilteredData.filter(
    (item) => item.total_requests >= 10
  );

  return (
    <div className="h-[580px] w-full rounded-xl bg-white p-5 shadow-card transition-transform hover:-translate-y-3 shadow-lg hover:border border-slate-300">
      <Bar
        ref={ref}
        data={{
          labels: filteredData.map((item) => item.clinic_name),

          datasets: [
            {
              label: "Total Requests",

              data: filteredData.map(
                (item) => item.total_requests
              ),

              backgroundColor: [
                "rgba(243, 103, 9, 0.6)",
                "rgb(8, 202, 232)",
                "rgba(21, 250, 13, 0.6)",
                "rgba(249, 27, 179, 0.94)",
                "rgba(252, 43, 78, 0.9)",
              ],

              borderColor: "rgb(11, 162, 250)",
              borderWidth: 1,
              borderRadius: 6,
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
              text: title,
              color: "black",
              font: {
                size: 18,
                weight: "bold",
              },
            },

            datalabels: {
              anchor: "end",
              align: "top",
              color: "black",
              font: {
                weight: "bold",
                size: 16,
              },
              formatter: (value) => value,
            },

            tooltip: {
              enabled: true,
            },
          },

          scales: {
            x: {
              title: {
                display: true,
                text: "Clinics",
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
                  size: 14,
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
                stepSize: 500,
                color: "black",
                font: {
                  size: 14,
                },
              },
            },
          },
        }}
      />
    </div>
  );
});

export default ClinicChart;