import {
  Bar
} from "react-chartjs-2";

import "chart.js/auto";

function MonthlyChart({ data }) {

  return (

    <div className="chart-card">

      <h2>Monthly Requests</h2>

      <Bar
        data={{
          labels: data.map(
            (item) => item.month_name
          ),

          datasets: [
            {
              label: "Requests",

              data: data.map(
                (item) => item.request_count
              ),

              // backgroundColor:[
              //   rgba(255, 99, 132, 0.6),
              //   rgba(54, 162, 235, 0.6),
              //   rgba(255, 205, 86, 0.6),
              //   rgba(75, 192, 192, 0.6),
              //   rgba(153, 102, 255, 0.6),
              // rgb(255, 99, 132),
              // rgb(54, 162, 235)

              // ]
               backgroundColor: "rgba(75, 192, 192, 0.6)",
            }
          ]
        }}
      />

    </div>

  );
}

export default MonthlyChart;