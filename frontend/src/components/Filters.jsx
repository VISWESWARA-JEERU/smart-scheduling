import { useState } from "react";

function Filters({ onFilter }) {

  const [month, setMonth] = useState("");

  return (

    <div className="filter-box">

      <input
        type="text"
        placeholder="Enter month"
        value={month}
        onChange={(e) =>
          setMonth(e.target.value)
        }
      />

      <button
        onClick={() => onFilter(month)}
      >
        Filter
      </button>

    </div>

  );
}

export default Filters;