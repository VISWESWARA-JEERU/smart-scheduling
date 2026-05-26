function KPICards({ data, requestData }) {

  return (

    <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="rounded-xl bg-white p-6 shadow-card transition-transform hover:-translate-y-1">
        <h3 className="mb-2 text-sm font-medium text-slate-500">Total Requests</h3>
        <p className="text-3xl font-bold text-slate-900">{data.total_requests}</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-card transition-transform hover:-translate-y-1">
        <h3 className="mb-2 text-sm font-medium text-slate-500">Total Clinics</h3>
        <p className="text-3xl font-bold text-slate-900">{data.total_clinics}</p>
      </div>

      {requestData.map((item, index) => (
        <div
          className="rounded-xl bg-white p-6 shadow-card transition-transform hover:-translate-y-1"
          key={index}
        >
          <h3 className="mb-2 text-sm font-medium text-slate-500">{item.user_request}</h3>
          <p className="text-3xl font-bold text-slate-900">{item.total}</p>
        </div>
      ))}
    </div>

  );
}

export default KPICards;