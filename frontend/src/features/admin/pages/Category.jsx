import { useEffect, useState } from "react";
import api from '../../../api'
import Toast from '../../../components/common/Toast'
function Category() {
      const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
        const [toast, setToast] = useState({id: 0, message: "", type: "success" });
   
  const fetchCategories = async () => {
    const response = await api.get("/admin/getcategories");
    setCategories(response.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
const showToast = (message,type="success")=>{
  setToast({  id: Date.now(), message, type });
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    if (editId) {
      await api.put(`/admin/updatecategory/${editId}`, formData);
     showToast("Category updated successfully");
      setEditId(null);
    } else {
      await api.post("/admin/addcategory", formData);
     showToast("Category added successfully");
    }

    setName("");
    setImage(null);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
    showToast("Editing category");

  };

  const toggleBlock = async (id) => {
    await api.patch(`/admin/toggleblock/${id}`);
    showToast("Category status updated");
    fetchCategories();
  };
  return (
   <div className="p-4 max-w-4xl mx-auto">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-(--secondary) p-4 rounded-xl shadow mb-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editId ? "Edit Category" : "Add Category"}
        </h2>

        <input
          type="text"
          placeholder="Category Name"
          className="w-full border border-slate-200 p-2 rounded focus:outline-none focus:ring-1 focus:ring-(--accent)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="file"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />

        <button className=" bg-(--accent) text-(--secondary) px-4 py-2 rounded">
          {editId ? "Update" : "Submit"}
        </button>
      </form>

      {/* Table */}
     <div className='w-full min-w-0 rounded-lg shadow-md mt-6'>
           <div className='w-full overflow-x-auto'> 
        <table className=" bg-(--secondary) text-sm w-full whitespace-nowrap">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t last:border-t-0 border-t-slate-200">
                <td className="p-3 text-center">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded "
                  />
                </td>
                <td className="p-3 text-center">{cat.name}</td>
                <td className="p-3 text-center">
                  {cat.isBlocked ? (
                    <span className="text-red-500 ">Blocked</span>
                  ) : (
                    <span className="text-green-600 ">Active</span>
                  )}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleBlock(cat._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    {cat.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> 
      </div>
           {toast.message && <Toast  key={toast.id} message={toast.message} type={toast.type} />}

    </div>
  );
}

export default Category