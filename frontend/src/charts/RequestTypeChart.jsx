import {
  Doughnut
} from "react-chartjs-2";

import "chart.js/auto";
import "../components/KPICards.jsx";
import ChartDataLabels from "chartjs-plugin-datalabels";

function RequestTypeChart({ data }) {

  return (

    <div className="chart-card rounded-xl bg-white p-5 shadow-card">
      <h2 className="mb-4 text-xl font-semibold text-slate-700">Request Types</h2>
      <Doughnut
        data={{
          labels: data.map(
            (item) => item.user_request
          ),

          datasets: [
            {
              label: "Requests",
          
              data: data.map(
                (item) => { 
                  console.log(item.total);
                  return item.total; }
               
              ),

              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF"
              ]
            }
          ]
        }}

        plugins={[ChartDataLabels]}

        options={{

          responsive: true,

          plugins: {

            legend: {
              position: "bottom"
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