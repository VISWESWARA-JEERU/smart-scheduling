import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./components/chart";

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {

    axios.get("http://127.0.0.1:8000/api/metrics")
      .then((response) => {

        setData(response.data);

      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>Smart Scheduling Dashboard</h1>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Month</th>
            <th>Clinic Name</th>
            <th>User Request</th>
          </tr>
        </thead>

        <tbody>

          {data.map((item, index) => (

            <tr key={index}>
              <td>{item.month_name}</td>
              <td>{item.clinic_name}</td>
              <td>{item.user_request}</td>
            </tr>

          ))}

        </tbody>

      </table>

      <Chart data={data} />

    </div>
  );
}

export default App;