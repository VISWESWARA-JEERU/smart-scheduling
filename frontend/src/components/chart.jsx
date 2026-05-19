// Chart.jsx
import "chart.js/auto";
import { Bar,Doughnut,Line } from "react-chartjs-2";


const Chart = ({ data }) => (
  <>
    <h2>Monthly Requests</h2>
    <responsive-container width="100%" height={300}>

   <Bar
    data={{
    labels: data.map((item) => item.month_name),
    datasets: [
      {
        label: "Request Count",
        data: data.map((item) => item.request_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      }
    ],
  }}
  options={{
    scales: {
      y: {  beginAtZero: true }
    }
  }}  
  ></Bar>
  <Doughnut
    data={{
      labels: data.map((item) => item.month_name),
      datasets: [
        {
          label: "Request Count",
          data: data.map((item) => item.request_count),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        }
      ],
    }}
    options={{
      responsive: true,
      plugins: { legend: { position: "top" } },
    }}
  ></Doughnut>
  
  </responsive-container>
  </>
);

export default Chart;
