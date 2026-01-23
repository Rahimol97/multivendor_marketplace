import {useEffect,useState} from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import api from '../../../api';
import ConfirmModal from "../../../components/common/ConfirmModal";
import Toast from "../../../components/common/Toast";

function VendorApprovals() {
  const [pendings,setPendings] = useState([]);
  const [selectedVendor,setSelectedVendor] =useState(null);
  const [actionType,setActiontype] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(()=>{
  getPendingApprovals();
  },[]);

const getPendingApprovals =async()=>{
try{
const response = await api.get("/admin/pendings");
setPendings(response.data.pendings)
}
catch(error){
  alert(error.message);
}
};
const showToast = (message,type="success")=>{
  setToast({ message, type });
};

const handleConfirmAction = async () => {
    try {
      await api.patch(`/admin/updatestatus/${selectedVendor}`, {
        status: actionType
      });
      
      // remove from list
      setPendings((prev) =>
        prev.filter((v) => v._id !== selectedVendor)
      );

      showToast(`Vendor ${actionType} successfully`, "success");
    } catch (error) {
      showToast("Action failed", "error");
    } finally {
      setSelectedVendor(null);
      setActiontype("");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="w-full p-3">
        <h1 className="text-xl font-semibold text-(--text)">
          Vendor Approvals
        </h1>
        <p className="text-sm text-(--text)">
          Pending vendor requests
        </p>
      </div>

      {/* Table Card */}
      <div className=" w-full min-w-0 bg-(--secondary) rounded-xl shadow-md overflow-hidden">
     <div className="w-full overflow-x-auto">
        <table className="w-full  text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-(--text)">
              <th className="px-4 py-3">Vendor</th>
              <th  className="px-4 py-3">Shop Name</th>
              <th  className="px-4 py-3">created date</th>
              <th  className="px-4 py-3">Status</th>
              <th className="text-center px-6">Actions</th>
            </tr>
          </thead>

          <tbody >
            {pendings.map((vendor,i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition border-b last:border-b-0 border-b-slate-200"
              >
                {/* Vendor Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                
                    <div>
                      <p className="font-medium text-(--text)">
                       {vendor.vendorName}
                      </p>
                      <p className="text-xs text-(--text)">
                         {vendor.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Shop */}
                <td className="text-(--text)">
                  {vendor.shopName}
                </td>
    <td className="text-(--text)">
                  {vendor.createdAt}
                </td>
                {/* Status */}
                <td>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                   {vendor.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={()=>{setSelectedVendor(vendor._id);setActiontype("approved")}} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition">
                      <CheckIcon className="w-4 h-4 cursor-pointer" />
                    </button>
                    <button onClick={()=>{setSelectedVendor(vendor._id);setActiontype("rejected")}} className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition">
                      <XMarkIcon className="w-4 h-4 cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      {/* confirmation box */}
<ConfirmModal
        open={!!selectedVendor}
        title={`Confirm ${actionType}`}
        description={`Are you sure you want to ${  actionType === "approved" ? "approve" : "reject"} this vendor?`}
        onCancel={() => {
          setSelectedVendor(null);
          setActiontype("");
        }}
        onConfirm={handleConfirmAction}
      />
 <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}

export default VendorApprovals;
