import { useEffect, useState } from "react";
import API from "../services/api";
import "../index.css";

//import "../App.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import KPICards from "../components/KPICards";
import MonthlyChart from "../charts/MonthlyChart";
import ClinicChart from "../charts/ClinicChart";
import RequestTypeChart from "../charts/RequestTypeChart";
// import Reports from "../pages/Reports";
//import DataTable from "../components/DataTable";
import Filters from "../components/Filters";

function Dashboard() {

  const [monthlyData, setMonthlyData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [requestTypeData, setRequestTypeData] = useState([]);
  // const[selectedYear,setSelectedYear]= useState([]);
  // const [selectedMonth, setSelectedMonth] = useState(null);
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const [kpiData, setKpiData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  const fetchDashboardData = async () => {

    try {

      const monthlyRes =
        await API.get("/monthly-requests", {
          params: {
            year: selectedYear,
          },
        });

      const clinicRes =
        await API.get("/clinic-requests", {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        });
      // API.get("/clinic-requests");


      const requestTypeRes =
        await API.get("/request-types", {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        }
        );

      await API.get("/metrics");


      const kpiRes =
        await API.get("/kpi", {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
        }
        );

      setMonthlyData(monthlyRes.data);

      setClinicData(clinicRes.data);

      setRequestTypeData(requestTypeRes.data);

      // setTableData(metricsRes.data);


      setKpiData(kpiRes.data);

    } catch (error) {

      console.log(error);

    }

  };

  const filterByMonth = async (month) => {

    try {

      const response = await API.get(
        `/filter/month/${month}`
      );

      setTableData(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // const handleMonthClick = async (month) => {
  //   try {
  //     setSelectedMonth(month);

  //     const response = await API.get(`/clinic-requests/month/${month}`);

  //     setClinicData(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };



  return (
    <>

      
      <div >
       <div className=" p-0 m-0 min-h-screen w-full bg-slate-100 flex " >
          <Sidebar />
       
          {/* Sidebar */}

          {/* Main Content */}
          <div className="flex-2 p-6 sm:p-7">
             <Navbar />
            <div className="w-full flex flex-row gap-8">
              {/* Dashboard Filters */}
              <div className=" w-1/2 mb-6 flex flex-wrap items-center gap-18 rounded-2xl bg-white p-5 shadow-lg">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Dashboard Filters
                  </h2>

                  <p className="text-sm text-black-500">
                    Filter dashboard analytics by month and year
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-8">

                  {/* Month Filter */}
                  <div className="flex flex-col ">
                    <label htmlFor="month"className="mb-1 text-sm font-semibold text-slate-600">
                      Month
                    </label>

                    <select id="month"
                      value={selectedMonth}
                      onChange={(e) =>
                        setSelectedMonth(Number(e.target.value))
                      }
                      className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value={1}>January</option>
                      <option value={2}>February</option>
                      <option value={3}>March</option>
                      <option value={4}>April</option>
                      <option value={5}>May</option>
                      <option value={6}>June</option>
                      <option value={7}>July</option>
                      <option value={8}>August</option>
                      <option value={9}>September</option>
                      <option value={10}>October</option>
                      <option value={11}>November</option>
                      <option value={12}>December</option>
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="flex flex-col">
                    <label htmlFor="year" className="mb-1 text-sm font-semibold text-slate-600">
                      Year
                    </label>

                    <select
                      id="year"
                      value={selectedYear}
                      onChange={(e) =>
                        setSelectedYear(Number(e.target.value))
                      }
                      className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >

                      <option value={2026}>2026</option>
                      <option value={2025}>2025</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* export butons */}
              <div className=" w-1/2 mb-6 flex flex-wrap items-center gap-5 rounded-2xl bg-white p-5 shadow-lg">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Reports
                  </h2>

                  <p className="text-sm text-black-500">
                    export reports based on selected filters
                  </p>
                </div>
                <div className=" flex flex-col">
                  <label htmlFor="clinic" className="mb-1 text-sm font-semibold text-slate-600">Clinics</label>
                  <select id="clinic" className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="" default>All Clinics</option>
                    {clinicData.map((clinic) => (
                      <option key={clinic.clinic_name} value={clinic.clinic_name}>
                        {clinic.clinic_name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="rounded-lg px-4 py-2 text-white bg-blue-600 font-medium hover:bg-green-600 transition-colors">Export CSV</button>
                <button className="rounded-lg px-4 py-2 text-white bg-blue-600 font-medium hover:bg-green-600 transition-colors">Export PDF</button>
              </div>
            </div>


            {/* KPI Cards */}
            <div className="mb-6">
              <KPICards
                data={kpiData}
                requestData={requestTypeData}
              />
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">

              <MonthlyChart data={monthlyData} />

              <ClinicChart
                data={clinicData}
                title={`Clinic Requests - ${selectedMonth}/${selectedYear}`}
              />

              <div className="lg:col-span-2 h-[900px] w-[1100px]">
                <RequestTypeChart data={requestTypeData} />
              </div>

            </div>

          </div>
        </div>


      </div>
    </>
  );
}

export default Dashboard;