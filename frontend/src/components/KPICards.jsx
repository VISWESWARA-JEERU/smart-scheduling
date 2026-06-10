function KPICards({ data, requestData }) {
  // list =["Appointment Confirmation/Inquiry","Front Desk Request","No User Request (Silent Call)"]
  return (

    <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="rounded-xl bg-orange-100 p-6 shadow-card transition-transform hover:-translate-y-3">
        <h3 className="mb-2 text-sm font-medium text-black-500">Total Requests</h3>
        <p className="text-3xl font-bold text-slate-900 ">{data.total_requests}</p>
        <p className="mt-1 text-sm text-slate-500">100% of calls</p>
      </div>

      {/* <div className="rounded-xl bg-white p-6 shadow-card transition-transform hover:-translate-y-1">
        <h3 className="mb-2 text-sm font-medium text-slate-500">Total Clinics</h3>
        <p className="text-3xl font-bold text-slate-900">{data.total_clinics}</p>
      </div> */}

      {requestData
        .filter((item) =>
          [
            "Appointment Confirmation/Inquiry",
            "Front Desk Request",
            "No User Request (Silent Call)",
          ].includes(item.user_request)
        )
        .map((item, index) => {
          const colors = ["bg-green-100", "bg-blue-100", "bg-red-100"];
          const textColors = ["text-green-900", "text-blue-900", "text-red-900"];
          const bgColor = colors[index % colors.length];
          const textColor = textColors[index % textColors.length];
          return (
            <div
              className={`rounded-xl ${bgColor} p-6 shadow-card transition-transform hover:-translate-y-3`}
              key={item.user_request}
            >
              <h3 className={`mb-2 text-sm font-medium ${textColor}`}>{item.user_request}</h3>
              <p className={`text-3xl font-bold ${textColor}`}>{item.total}</p>
              <p className="mt-1 text-sm text-slate-500">
                {data.total_requests ? ((item.total / data.total_requests) * 100).toFixed(2) : 0}% of calls
              </p>
            </div>
          );
        })}
    </div>

  );
}

export default KPICards;