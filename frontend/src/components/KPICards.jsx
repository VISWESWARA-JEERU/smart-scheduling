function KPICards({ data, requestData }) {

  return (

    <div className="kpi-container">

      {/* Existing KPI Cards */}

      <div className="kpi-card">

        <h3>Total Requests</h3>

        <p>{data.total_requests}</p>

      </div>

      <div className="kpi-card">

        <h3>Total Clinics</h3>

        <p>{data.total_clinics}</p>

      </div>

      {/* Dynamic Request Type Cards */}

      {requestData.map((item, index) => (

        <div
          className="kpi-card"
          key={index}
        >

          <h3>{item.user_request}</h3>

          <p>{item.total}</p>

        </div>

      ))}

    </div>

  );
}

export default KPICards;