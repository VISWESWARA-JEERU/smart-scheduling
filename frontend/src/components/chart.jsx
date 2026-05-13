import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Chart = ({ data }) => (
  <>
    <h2>Monthly Requests</h2>
    <BarChart width={700} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month_name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="request_count" fill="#8884d8" />
    </BarChart>
  </>
);

export default Chart;
