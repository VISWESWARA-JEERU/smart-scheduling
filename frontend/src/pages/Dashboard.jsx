import { useEffect, useState } from "react";

import API from "../services/api";


import "../App.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import KPICards from "../components/KPICards";
import MonthlyChart from "../charts/MonthlyChart";
import ClinicChart from "../charts/ClinicChart";
import RequestTypeChart from "../charts/RequestTypeChart";

//import DataTable from "../components/DataTable";
//import Filters from "../components/Filters";

function Dashboard() {

  const [monthlyData, setMonthlyData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [requestTypeData, setRequestTypeData] = useState([]);
  // const [tableData, setTableData] = useState([]);

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

      await API.get("/metrics");


      const kpiRes =
        await API.get("/kpi");

      setMonthlyData(monthlyRes.data);

      setClinicData(clinicRes.data);

      setRequestTypeData(requestTypeRes.data);

      // setTableData(metricsRes.data);


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

    <div className="min-h-screen w-full bg-slate-100">
      <Navbar />

      <div className="flex w-full">
        <Sidebar />

        <div className="flex-1 p-6 sm:p-7">
          <KPICards data={kpiData} requestData={requestTypeData} />

          <div className="mb-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MonthlyChart data={monthlyData} />
            <ClinicChart data={clinicData} />
            <RequestTypeChart data={requestTypeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;