import {
  Line,Bar
} from "react-chartjs-2";

import "chart.js/auto";

function ClinicChart({ data }) {

  return (

    <div className="chart-card">

      <h2>Clinic Requests</h2>

      <Bar
        data={{
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
       
      />

    </div>

  );
}

export default ClinicChart;