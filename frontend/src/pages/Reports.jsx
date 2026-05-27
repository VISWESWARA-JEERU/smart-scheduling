import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
// import KPICards from "../components/KPICards"; 
import ReportFilters from "../components/reports/ReportFilters";

function Reports() {

   const [reportData, setReportData] = useState([]);
   const [tableData, setTableData] = useState([]);



    useEffect(() => {
       fetchReportsData();
     }, []);
    



     const fetchReportsData = async () => {
       try {
         const reportsdata = await API.get("/reports");
        // const tabledata = await API.get("/api/report-table");
      


       } catch (error) {
         console.error("Error fetching reports data:", error);
       }
       setReportData(reportsdata.data);
       // setTableData(tabledata.data);
     };



  return (
    <div className="min-h-screen bg-slate-100">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-6">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                Reports
              </h1>

              <p className="text-slate-500">
                Generate and export reports
              </p>
            </div>

            <div className="flex gap-8  ">
              <button className="rounded-lg px-4 py-2 text-white bg-blue-600 font-medium hover:bg-green-600 transition-colors">Export CSV</button>
              <button className="rounded-lg px-4 py-2 text-white bg-blue-600 font-medium hover:bg-green-600 transition-colors">Export PDF</button>
            </div>

          </div>

          {/* Filters */}
           <ReportFilters data={{ reportData }} /> 

          {/* KPI Cards
          <SummaryCards />

          {/* Charts 
          <ReportCharts /> */}

          {/* Table */}
          {/* <ReportTable /> */}

        </main>

      </div>

    </div>
  );
}
 export default Reports;





















// function Reports() {
//   return (
//     <div className="min-h-screen bg-slate-100">
//       <Navbar />

//       <div className="flex">
//         <Sidebar />

//         <main className=" flex-1 flex-row p-6">
//           <h1 className=" mb-6 text-2xl font-bold text-slate-800" >
//             Reports
//           </h1>

//           <div className="w-1/4 mb-6 rounded-xl bg-white p-6 shadow-lg">
//             Report Filters
//           </div>

//           <div className="w-1/4 rounded-xl bg-white p-6 shadow-lg">
//             Report Table
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

