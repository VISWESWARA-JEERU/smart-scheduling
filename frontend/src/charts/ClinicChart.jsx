import {
  Line,Bar
} from "react-chartjs-2";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";
Chart.register(ChartDataLabels);

function ClinicChart({ data }) {
  const sortedData = [...(data || [])].sort(
    (a, b) => b.total_requests - a.total_requests
  );
  const filteredData = sortedData.filter((item) => item.total_requests >= 10);

  return (

    <div className="h-[580px] w-full chart-card rounded-xl bg-white p-5 shadow-card">
      <Bar
        data=
        {
          {
          labels: filteredData.map(
            (item) => item.clinic_name
          ),

          datasets: [
            {
              label: "Total Requests",
         
              data: sortedData.map(
                (item) => item.total_requests
              
              ),
              
              backgroundColor:[
                "rgba(243, 103, 9, 0.6)",
                "rgb(8, 202, 232)",
                "rgba(21, 250, 13, 0.6)",
                "rgba(249, 27, 179, 0.94)",
                "rgba(252, 43, 78, 0.9)",
               ],

              borderColor:
                "rgb(11, 162, 250)",
               
                
                
            }
          ]
          
        }}
        options=
        {{
          responsive: true, 
          maintainAspectRatio: false,
          plugins:
          {
            legend:{
              display:true,
              title:{
              display:true,
              text:"Clinic Requests",
              color: "black",
              font: {
                size: 18,
                weight: "bold"
            
              }
            }
            },
            datalabels: {
              
              anchor: "end",
              align: "top",
              color: "black", 
              font: {
                weight: "bold",
                size: 18
            },
    
            },


            tooltip: {
              enabled: true,
              
            }
          
           
          },

          scales: { 
            x:{
              title: {
                display: true,
                text: "Clinics",
                color: "black",
                font: {
                  size: 18,
                  weight: "bold"
                }
              },
              ticks: {
                autoSkip: false,
                maxRotation: 30,
                minRotation: 0,
                color: "black",
                font:{ size: 18}
              }},

              y: {
                beginAtZero: true,
               
                title: {
                  display: true,
                  text: "Number of Requests",
                  color: "black",
                  font: {
                    size: 18,
                    weight: "bold"  
                  }
                },
                 ticks: {
                  stepSize: 500,
                  color: "black",
                  font:{ size: 18}
                }
              }
           }
        
        
    
      }
      }   
     />


    </div>

  );
}

export default ClinicChart;