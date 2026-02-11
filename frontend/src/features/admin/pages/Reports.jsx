import { useEffect, useState } from "react";
import api from "../../../api";
import Pagination from "../../../components/common/pagination";

function Reports() {
  const [report, setReport] = useState([]);
  const [fdate, setFdate] = useState("");
  const [tdate, setTdate] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalpages:1
  });
    useEffect(()=>{
     const today = new Date().toISOString().split("T")[0];
     setFdate(today);
     setTdate(today);
    },[])
  const fetchReport = async () => {
    const { data } = await api.get("/admin/vendor-sales-report", {
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
      <h2 className="text-xl font-bold mb-4">Vendor Sales Report</h2>

      {/* Date Filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="date" value={fdate} onChange={e => setFdate(e.target.value)} className="border p-2 rounded"/>
        <input type="date" value={tdate} onChange={e => setTdate(e.target.value)} className="border p-2 rounded"/>
        <button onClick={fetchReport} className="bg-(--accent) text-white px-4 py-2 rounded">Filter</button>
      </div>

      {/* Desktop Table */}
      <div className="w-full min-w-0 bg-white rounded-lg shadow-md mt-6">
          <div className='w-full overflow-x-auto'>
        <table className="text-sm w-full whitespace-nowrap">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Vendor</th>
              <th>Orders</th>
              <th>Gross Sales</th>
              <th>Commission</th>
              <th>Vendor Earnings</th>
            </tr>
          </thead>
          <tbody>
            {report.map(v => (
              <tr key={v.vendorId} className="border-b last:border-b-0 border-b-slate-200">
                <td className="p-3">{v.shopName}</td>
                <td>{v.totalOrders}</td>
                <td>₹{Number(v.grossSales).toFixed(2)}</td>
                <td className="text-red-600">₹{Number(v.totalCommission).toFixed(2)}</td>
                <td className="text-green-600 font-semibold">₹{Number(v.totalVendorEarning).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

     
    

      {/* Pagination */}
                  <Pagination
                         currentpage={page}
                         totalpage={pagination.totalpages}
                         onPageChange={setPage}
                       />
    </div>
  );
}

export default Reports;
