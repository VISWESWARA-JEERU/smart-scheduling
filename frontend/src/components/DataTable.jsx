function DataTable({ data }) {

  return (

    <div className="table-wrapper">

      <table>

        <thead>

          <tr>

            <th>Month</th>

            <th>Clinic</th>

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

    </div>

  );
}

export default DataTable;