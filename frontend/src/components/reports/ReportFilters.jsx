function ReportFilters(data) {
    // const clinic_names = data.clinic_name;
    
  return (
    <div className="w-full mb-6 rounded-xl bg-white p-6 shadow-lg"> 

        <h2 className="mb-4 text-xl font-bold text-slate-700">Report Filters</h2>
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
                <label htmlFor="month" className="text-slate-600">Month:</label>
                <select id="month" lassName="rounded border border-gray-300 p-2">
                    <option value="">Select Month</option>
                    <option value="jan">January</option>
                    <option value="feb">February</option>
                    <option value="mar">March</option>
                    <option value="apr">April</option>
                    <option value="may">May</option>
                    <option value="jun">June</option>
                    <option value="jul">July</option>
                    <option value="aug">August</option>
                    <option value="sep">September</option>
                    <option value="oct">October</option>
                    <option value="nov">November</option>
                    <option value="dec">December</option>
                </select>
            </div>
            <div className="flex items-center space-x-4">
                <label htmlFor="clinic" className="text-slate-600">Clinic:</label>
                <select id="clinic" className="rounded border border-gray-300 p-2">
                    <option value="">Select Clinic</option>
                    {data.map((clinic) => (
                        <option key={clinic} value={clinic}>{clinic}</option>
                    ))}
                </select>

                    
            </div>
        </div>
    </div>
  );
}
export default ReportFilters;