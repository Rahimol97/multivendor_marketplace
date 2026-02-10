import React, { useState,useEffect } from "react";
import api from '../../../api'
import Pagination from '../../../components/common/pagination'
import FormatDate from "../../../components/common/Formatdatetime";

function UserVendorManager() {
const [customers,setcustomers]= useState([]);
const [vendors,setvendors]= useState([]);
const [paginationcount,setPagnationcount] = useState({
  totalcustomers:0,
  totalPages:1,
})
const [paginationvendor,setPagnationvendor] = useState({
  totalvendors:0,
  totalPages:1,
})

const [searchc,setSearchc] = useState("");
const [searchv,setSearchv] = useState("");
// customer pagination
 const [pagec, setPagec] = useState(1);
const limitc =1;
 /////vendors pagination
 const [pagev, setPagev] = useState(1);
  const limitv = 10;

 useEffect(() => {
    getcustomers();
  }, [searchc, pagec]);

   useEffect(() => {
    getvendors();
  }, [searchv, pagev]);
  ////customer list
  const getcustomers = async()=>{
    try{
     const response = await api.get(`/admin/allcustomers?search=${searchc}&page=${pagec}&limit=${limitc}`) 
     setcustomers(response.data.customers);
    setPagnationcount(response.data.pagination);
    }
    catch (error) {
      console.log("Error fetching customers:", error);
    }
  };
  /////vendor list 
    const getvendors = async()=>{
    try{
     const response = await api.get(`/admin/allvendors?search=${searchv}&page=${pagev}&limit=${limitv}`) 
     setvendors(response.data.vendors);
    setPagnationvendor(response.data.pagination);
    }
    catch (error) {
      console.log("Error fetching customers:", error);
    }
  };
  /////blockuser
  const blockuser =async(id)=>{
    try{
   const response = await api.patch(`/admin/blockUser/${id}`);
     getcustomers();   // refresh
    getvendors(); 
    }
        catch (error) {
      console.log("Error fetching customers:", error);
    }
  }
  return (
    <div className="p-4 md:p-6 w-full min-w-0 ">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4 w-full min-w-0 ">
        <input
          type="text"
          value={searchc}
          onChange={(e) => {setSearchc(e.target.value);setPagec(1);}}
          placeholder="Search by username / email / mobile..."
          className="w-full md:w-1/2 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none"
        />

        <div className="text-md text-(--accent) whitespace-nowrap">
          showing: <span className="font-semibold text-xl"> {customers.length}/{paginationcount.totalcustomers}</span>
        </div>
      </div>

      {/* Table */}
      <div className="w-full min-w-0 rounded-lg  shadow-md bg-(--secondary)">
        {/* scroll */}
        <div className="w-full overflow-x-auto">
          <table className=" w-full text-sm whitespace-nowrap">
            <thead  className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Customername</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Last Login At</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3 text-center ">Block/Unblock</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer)=>(
                <tr key={customer._id} className="border-b last:border-b-0 border-b-slate-200  ">
                  <td className="px-4 py-3">{customer.user_id?.username}</td>
                  <td className="px-4 py-3">{customer.customerName}</td>
                  <td className="px-4 py-3">{customer.user_id?.email}</td>
                  <td className="px-4 py-3">{customer.mobile}</td>
                  <td className="px-4 py-3"> <FormatDate date={customer.lastLoginAt} /></td>
                  <td className="px-4 py-3">  <FormatDate date={customer.createdAt} /></td>
                  <td className="px-4 py-3 text-center">
                    <button   onClick={()=>blockuser(customer.user_id._id)}
                      className ={`px-3 py-1 rounded text-(--secondary) cursor-pointer ${customer.isActive ? "bg-green-600" : "bg-red-600"}`}>
                     {customer.isActive ? "block" : "unblock"}
                    </button>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colspan="5" className="px-4 py-6 text-center text-(--text) "> No Customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
  currentpage={pagec}
  totalpage={paginationcount.totalPages}
  onPageChange={setPagec}
/>
<h1 className="text-2xl font-bold mt-4">Vendors</h1>
    
 <div className="flex flex-col md:flex-row gap-3 md:items-center  w-full min-w-0 mt-3 mb-5">
        <input
          type="text"
          value={searchv}
          onChange={(e) => {setSearchv(e.target.value);setPagev(1);}}
          placeholder="Search by username / email / mobile..."
          className="w-full md:w-1/2 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none"
        />

        <div className="text-md text-(--accent) whitespace-nowrap">
          showing:<span className="font-semibold text-xl">{vendors.length}/{paginationvendor.totalvendors}</span>
        </div>

      </div>
  <div className="w-full min-w-0 rounded-lg border border-slate-200 shadow-md bg-(--secondary)">
        {/* scroll */}
        <div className="w-full overflow-x-auto">
          <table className=" w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50" >
              <tr className="text-left">
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">shopname</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Last Login At</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3 text-center ">Block/Unblock</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor)=>(
                <tr key={vendor._id} className="border-b last:border-b-0 border-b-slate-300">
                  <td className="px-4 py-3">{vendor.user_id?.username}</td>
                  <td className="px-4 py-3">{vendor.shopName}</td>
                  <td className="px-4 py-3">{vendor.user_id?.email}</td>
                  <td className="px-4 py-3">{vendor.mobile}</td>
                  <td className="px-4 py-3"><FormatDate date={vendor.lastLoginAt} /></td>
                  <td className="px-4 py-3"><FormatDate date={vendor.createdAt}/></td>
                  <td className="px-4 py-3 text-center">
                    <button   onClick={()=>blockuser(vendor.user_id._id)}
                      className ={`px-3 py-1 rounded text-(--secondary) cursor-pointer ${vendor.isActive ? "bg-green-600" : "bg-red-600"}`}>
                     {vendor.isActive ? "block" : "unblock"}
                    </button>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              ))}
              {vendors.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-(--text) "> No vendors found</td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>
        
      </div>
      <Pagination
  currentpage={pagev}
  totalpage={paginationvendor.totalPages}
  onPageChange={setPagev}
/>
    </div>
  );
}

export default UserVendorManager;
