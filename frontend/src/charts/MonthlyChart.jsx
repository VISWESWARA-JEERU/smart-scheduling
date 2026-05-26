import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";
import { Chart } from "chart.js";
Chart.register(ChartDataLabels);

function MonthlyChart({ data }) {

  return (

    <div className="chart-card rounded-xl bg-white p-5 shadow-card">
      <Bar
        data={{
          labels: data.map((item) => item.month_name ),font: {
            size: 16,
            weight: "bold"
          },
        

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
               hoverBackgroundColor: "rgba(239, 32, 32, 0.8)",
               borerRadius: 5
            }
          ]
        }}
        plugins={[ChartDataLabels]}
        options={{
            responsive: true, 

            plugins:
            {
              legend:{
                display:true
              },
              title:{
              display:true,
              text:"Monthly Requests",
              font: {
                size: 18
              }
               },
            tooltip: {
            enabled: true,
            // callbacks: {
            //   label: function(context) {
            //     return context.parsed.y + " requests";  },    
            //   }
             },
            datalabels: {
              // display: true,
              anchor: "end",
              align: "top",
              color: "black", 
              font: {
                weight: "bold",
                size: 18
                // weight: "italic",
              },
              formatter: (value) => {
                if (value > 10)
                 return value;
                }
            }
          },

          scales: {
            x:{
              title: {
                display: true,
                text: "Month",
                font: {
                  size: 16,
                  weight: "bold"
                }
              },
              ticks: {
                autoSkip: false,
                maxRotation: 30,
                minRotation: 0,
                color: "black",
                fontstyle: "bold",
                font: {size: 18}
            }},
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Requests",
                font: {
                  size: 16,
                  weight: "bold"
                }
              },
              ticks: {
                autoSkip: false,
                stepSize: 500,
                color: "black",
                fontstyle: "bold",
                font: {size: 18}
              }
            }
          }
        

        }}
      
      />
      

    </div>

  );
}

export default MonthlyChart;