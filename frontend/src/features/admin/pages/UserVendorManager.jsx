import React, { useState, useEffect } from "react";
import api from "../../../api";

function UserVendorManager() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="p-4 md:p-6 ">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {/* search + filter */}
      <div className="w-full max-w-full px-2 overflow-x-hidden">
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4 w-full">
        <input
          type="text"
          placeholder="Search by username / email / mobile..."
          className="w-full  min-w-0 md:w-1/2 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none"
        />

        <select className="w-full min-w-0 md:w-48 border border-slate-300 rounded-lg px-4 py-2">
          <option value="all">all</option>
          <option value="active">active</option>
          <option value="blocked">Blocked</option>
        </select>

        <div className="text-sm text-blue-600">showing:</div>
      </div>
</div>
      {/* table */}
      <div className="w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm">
  <div className="w-screen md:w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
    <table className="min-w-(900px) w-full text-sm whitespace-nowrap">
      <thead className="bg-slate-100">
        <tr className="text-left">
          <th className="px-4 py-3 whitespace-nowrap">Username</th>
          <th className="px-4 py-3 whitespace-nowrap">Email</th>
          <th className="px-4 py-3 whitespace-nowrap">Mobile</th>
          <th className="px-4 py-3 whitespace-nowrap">Last Login At</th>
          <th className="px-4 py-3 whitespace-nowrap">Created At</th>
          <th className="px-4 py-3 whitespace-nowrap text-center">
            block/unblock
          </th>
        </tr>
      </thead>
    </table>
  </div>
</div>

    </div>
  );
}

export default UserVendorManager;
