import React,{useState,useEffect} from 'react'
import api from '../../../api'

function Lowstock() {
      const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true);
    const [lowStockcount, setLowStockcount] = useState(0);
     const getLowstock = async () => {
    try {
      const res = await api.get("/vendor/lowstock");
      console.log(res);
      setProducts(res.data.products);
      setLowStockcount(res.data.lowStockcount);
    } catch (err) {
      console.error("Failed to fetch low stock products");
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
    getLowstock();
    const interval = setInterval(getLowstock, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

 return (
  <div className="p-6 bg-(--primary) min-h-screen">
    {/* Header */}
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-(--text)">
        Low Stock Products
      </h1>

      {!loading && products.length > 0 && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold">
          {lowStockcount} Products Need Restock
        </div>
      )}
    </div>

    {/* Loading */}
    {loading ? (
      <p className="text-gray-500">Loading low stock products...</p>
    ) : products.length === 0 ? (
      <div className="bg-green-100 text-green-700 p-6 rounded-xl text-center font-medium">
        All products are well stocked 
      </div>
    ) : (
      <div className="overflow-x-auto bg-(--secondary) rounded-xl shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-red-50 text-red-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Current Stock</th>
              <th className="px-6 py-3">Minimum Stock</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-red-50/40 transition">
                <td className="px-6 py-4 font-medium text-(--text)">
                  {p.name}
                </td>

                <td className="px-6 py-4 text-red-600 font-bold">
                  {p.stock}
                </td>

                <td className="px-6 py-4">{p.minStock}</td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                    Low Stock
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

}

export default Lowstock