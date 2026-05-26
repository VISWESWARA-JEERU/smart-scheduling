import {
  Line,Bar
} from "react-chartjs-2";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";
Chart.register(ChartDataLabels);

function ClinicChart({ data }) {

  return (

    <div className="chart-card rounded-xl bg-white p-5 shadow-card">
      <Bar
        data=
        {
          {
          labels: data.map(
            (item) => item.clinic_name
          ),

          datasets: [
            {
              label: "Total Requests",
         
              data: data.map(
                (item) => item.total_requests
              
              ),
              
              backgroundColor:[
                "rgba(99, 115, 255, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 205, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
               ],

              borderColor:
                "rgb(11, 162, 250)",
               
                
                
            }
          ]
          
        }}
        options=
        {{
          responsive: true, 
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
                font:{size: 16}
              }},

              y: {
                beginAtZero: true,
               
                title: {
                  display: true,
                  text: "Number of Requests",
                  font: {
                    size: 18,
                    weight: "bold"  
                  }
                },
                 ticks: {
                  stepSize: 500,
                  color: "black",
                  font:{size: 18}
                },
              }
           }
        
        
    
      }
      }   
     />


    </div>

  );
}

export default ClinicChart;