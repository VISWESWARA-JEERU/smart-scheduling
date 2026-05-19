import { useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import API from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import KPICards from "../components/KPICards";
import MonthlyChart from "../components/MonthlyChart";
import ClinicChart from "../components/ClinicChart";
import RequestTypeChart from "../components/RequestTypeChart";
//import DataTable from "../components/DataTable";
//import Filters from "../components/Filters";

function Dashboard() {

  const [monthlyData, setMonthlyData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [requestTypeData, setRequestTypeData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [kpiData, setKpiData] = useState({});

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      const monthlyRes =
        await API.get("/monthly-requests");

      const clinicRes =
        await API.get("/clinic-requests");

      const requestTypeRes =
        await API.get("/request-types");

      const metricsRes =
        await API.get("/metrics");

      const kpiRes =
        await API.get("/kpi");

      setMonthlyData(monthlyRes.data);

      setClinicData(clinicRes.data);

      setRequestTypeData(requestTypeRes.data);

      setTableData(metricsRes.data);

      setKpiData(kpiRes.data);

    } catch (error) {

      console.log(error);

    }

  };

  // const filterByMonth = async (month) => {

  //   try {

  //     const response = await API.get(
  //       `/filter/month/${month}`
  //     );

  //     setTableData(response.data);

  //   } catch (error) {

  //     console.log(error);

  //   }

  // };

  return (

    <div className="dashboard">

      <Navbar />

      <div className="dashboard-layout">

        <Sidebar />

        <div className="dashboard-content">

          <KPICards data={kpiData} requestData={requestTypeData}/>

          {/* <Filters onFilter={filterByMonth} /> */}

          <div className="chart-grid">

            <MonthlyChart data={monthlyData} />

            <ClinicChart data={clinicData} />

            <RequestTypeChart
              data={requestTypeData}
            />

          </div>



        </div>

      </div>

    </div>
  );
}

export default Dashboard;