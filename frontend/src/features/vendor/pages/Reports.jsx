import { useEffect, useState } from "react";
import api from "../../../api";
import Pagination from "../../../components/common/pagination";

function Reports() {
  const [report, setReport] = useState([]);
  const [fdate, setFdate] = useState("");
  const [tdate, setTdate] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalpages: 1 });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFdate(today);
    setTdate(today);
  }, []);

  const fetchReport = async () => {
    const { data } = await api.get("/vendor/productsalesreport", {
      params: { fdate, tdate, page, limit: 10 },
    });
    setReport(data.report);
    setPagination(data.pagination);
  };

  useEffect(() => {
    fetchReport();
  }, [page]);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Product Sales Report</h2>

      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="date" value={fdate} onChange={e => setFdate(e.target.value)} className="border p-2 rounded"/>
        <input type="date" value={tdate} onChange={e => setTdate(e.target.value)} className="border p-2 rounded"/>
        <button onClick={fetchReport} className="bg-(--accent) text-white px-4 py-2 rounded">Filter</button>
      </div>

      <div className="w-full min-w-0 bg-white rounded-lg shadow-md mt-6">
        <div className="w-full overflow-x-auto">
          <table className="text-sm w-full whitespace-nowrap">
         <thead className="bg-gray-100 text-left">
  <tr>
    <th className="p-3">Product</th>
    <th>Category</th>
    <th>Qty Sold</th>
    <th>Gross Sales</th>
    <th className="text-red-600">Commission</th>
    <th className="text-green-600">Your Earnings</th>
  </tr>
</thead>
<tbody>
  {report.map(p => (
    <tr key={p.productId} className="border-b border-b-slate-200">
      <td className="p-3 flex items-center gap-2">
        <img src={p.images?.[0]?.url} alt="" className="w-10 h-10 object-cover rounded"/>
        {p.name}
      </td>
      <td>{p.category}</td>
      <td>{p.totalQty}</td>
      <td>₹{Number(p.grossSales).toFixed(2)}</td>
      <td className="text-red-600">₹{Number(p.totalCommission).toFixed(2)}</td>
      <td className="text-green-600 font-semibold">₹{Number(p.totalVendorEarning).toFixed(2)}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>

      <Pagination
        currentpage={page}
        totalpage={pagination.totalpages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default Reports;
