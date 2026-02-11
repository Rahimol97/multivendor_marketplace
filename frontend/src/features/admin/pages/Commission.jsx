import { useState, useEffect } from 'react'
import api from '../../../api'
import Toast from '../../../components/common/Toast'

function Commission() {
  const [commission, setCommission] = useState("");
  const [error, setError] = useState("");
  ////vendorwisecommision
  const [vendors, setVendors] = useState([]);
  const [globalCommission, setGlobalCommission] = useState(0);
  /////toast 
  const [toastmsg, setToastmsg] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const fetchCommission = async () => {
      try {
        const response = await api.get("/admin/global-commision");
        setCommission(response.data.globalCommission);
        setGlobalCommission(response.data.globalCommission);

        ///vendor-report
        const vendorRes = await api.get("/admin/vendor-commission-report")
      const formatted = vendorRes.data.final.map((v) => ({
  ...v,
  commissionEditable: v.commissionEditable,
}));
        setVendors(vendorRes.data.final);
        console.log(formatted)
      }
      catch (err) {
        console.log(err);
      }
    };
    fetchCommission();

  }, [])
  //////handlechange global commission
  const handleChange = (e) => {
    const value = e.target.value;
    setCommission(Number(value));
    if (value > 100) {
      setError("Commission cannot exceed 100%");
    }
    else if (value < 0) {
      setError("Commission cannot be less than 0%");
    }
    else {
      setError("");
    }
  };
  //////save gloal commission
  const handleglobalCommision = async () => {

    try {
      const response = await api.post("/admin/global-commision", { globalCommissionPercentage: commission });
      setToastType("success");
      setToastmsg("Commission saved ");
    }
    catch (err) {
      setToastType("error");
      setToastmsg("Server error");
    }
  };

  /////handle textbox vendoewise
 const handleVendorCommissionChange = (vendorId, value) => {
  setVendors(prev =>
    prev.map(v =>
      v.vendorId === vendorId
        ? { ...v, commissionEditable: value === "" ? "" : Number(value) }
        : v
    )
  );
};
  //////vendorwise update 
 const handleVendorUpdate = async (vendorId) => {
  try {
    const vendor = vendors.find((v) => v.vendorId === vendorId);

    if (vendor.commissionEditable === "" || vendor.commissionEditable == null) {
      setToastType("error");
      setToastmsg("Commission is required");
      return;
    }

    if (vendor.commissionEditable < 0 || vendor.commissionEditable > 100) {
      setToastType("error");
      setToastmsg("Commission must be between 0 and 100");
      return;
    }

    await api.put(`/admin/vendorwise-commision/${vendorId}`, {
      commission: Number(vendor.commissionEditable),
    });

    setToastType("success");
    setToastmsg("Vendor commission updated");

    const vendorRes = await api.get("/admin/vendor-commission-report");
    setVendors(vendorRes.data.final); 
  } catch (err) {
    console.log(err);
    setToastType("error");
    setToastmsg("Server error");
  }
};

  return (
    <div className='min-h-screen bg-(--secondary) px-4 py-6 space-y-8 rounded-lg md:px-8  '>
      {/* toastmsg */}
      <Toast message={toastmsg} type={toastType} onClose={() => setToastmsg("")} />
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 '>
        <h1 className="text-xl  font-bold text-(--text)">
          Platform Earnings & Commission
        </h1>

      </div>
      {/* ////////earnings report/// */}

      {/* platform commission */}
      <div className="w-full md:w-1/2 bg-(--secondary) shadow-lg rounded-xl p-5 md:p-6">
        <h2 className="text-lg font-semibold mb-4">
          Platform Commission (Global)
        </h2>

        {/* Input*/}
        <div className="flex items-center gap-3 max-w-md">
          <input
            type="text" onChange={handleChange} max={100} min={0} value={commission}
            placeholder="Enter commission"
            className="w-full border border-slate-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-(--accent)"
          />

          <span className="text-sm font-medium text-slate-600">%</span>
        </div>
        {/* validation message */}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Applied to all vendors unless a vendor-specific commission is configured.
        </p>

        <button onClick={handleglobalCommision}
          disabled={!!error} className="mt-5 bg-(--accent) px-8 py-3 rounded-lg text-(--secondary) font-medium hover:opacity-90 transition cursor-pointer">
          Save Platform Commission
        </button>
      </div>
      {/* vendorwisecommission */}
      <div className='bg-(--secondary) rounded-2xl shadow-lg p-5 md:p-6'>
        <h2 className="text-lg font-semibold mb-4">
          Vendor-wise  Commission
        </h2>
        {/* mobile */}

        <div className="space-y-4 md:hidden">
         {vendors.map((item)=>(
       <div key={item.vendorId} className="border rounded-xl p-4 space-y-2">
            <p className="font-semibold">{item.shopName}</p>
           
            <p className="font-semibold text-(--accent)">
             {item.vendorName}

            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm">Commission</span>
              <input
                type="number"
 min={0}
          max={100}
          value={item.commissionEditable}
          onChange={(e) =>
            handleVendorCommissionChange(item.vendorId, e.target.value)
          }

                className="w-20 border rounded px-2 py-1"
              />
              <span>%</span>
            </div>


            <button onClick={() => handleVendorUpdate(item.vendorId)} className="text-(--text) text-sm px-4 py-3 bg-(--accent) rounded-lg">Update</button>
          </div>
           ))}

        </div>
        {/* desktop */}
        <div className="hidden md:block overflow-x-auto ">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-b-(--accent) text-(--text)">
                <th className="py-3 text-left">Shopname</th>
                <th className="text-left">vendoename</th>
                <th className="text-left">Commission %</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((item) => (
              <tr key={item.vendorId} className='border-b border-b-slate-300'>
                <td className="py-4 font-medium">{item.shopName}</td>
                <td className="py-4 font-medium">{item.vendorName}</td>
                <td>₹{item.completedAmount}</td>
                <td>
                  <input type="number"  min={0}
          max={100}
          value={item.commissionEditable}  onChange={(e) =>
            handleVendorCommissionChange(item.vendorId, e.target.value)
          } className="w-20 border border-slate-300 rounded px-2 py-1 focus:outline-none" />
                </td>
               
                <td>
  <button
          onClick={() => handleVendorUpdate(item.vendorId)}
          className="text-(--accent) hover:underline cursor-pointer"
        >
          Update
        </button>
         </td>
              </tr>
             ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>




  )
}

export default Commission