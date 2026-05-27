import {
  Doughnut
} from "react-chartjs-2";

import "chart.js/auto";
import "../components/KPICards.jsx";
import ChartDataLabels from "chartjs-plugin-datalabels";

function RequestTypeChart({ data }) {
  const filteredData = data.filter((item) => item.total >= 10);

  return (

    <div className=" h-[600px] w-[1000px] p-5 chart-card rounded-xl bg-white shadow-card">
      <h2 className="mb-4 text-xl font-semibold text-slate-700">Request Types</h2>
      <Doughnut
        data={{
          labels: filteredData.map(
            (item) => item.user_request
          ),

          datasets: [
            {
              label: "Requests",

              data: filteredData.map(
                (item) => item.total
              ),

              backgroundColor: [
                "#36A2EB",
                "#fcec08",
                "#f50a26",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
                "#36A2EB",
                "#07ffda",
                "#26bf35",
                "#3e4695",
                "#FF9F40",
                ""
              ]
            }
          ]
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
                  const data = chart.data;

                  return data.labels.map((label, index) => ({
                    text: `${label} : ${data.datasets[0].data[index]}`,

                    fillStyle:
                      data.datasets[0].backgroundColor[index],

                    strokeStyle:
                      data.datasets[0].backgroundColor[index],

                    lineWidth: 0,

                    hidden: false,

                    index: index,

                    pointStyle: "circle",
                  }));
                },
              },
            },


            datalabels: {

              color: "black",

              font: {
                weight: "bold",
                size: 18,


              },

              // formatter: (value) => {
              //   return value;
              // }

            }

          }

        }}

      />

    </div>

  );
}

export default RequestTypeChart;