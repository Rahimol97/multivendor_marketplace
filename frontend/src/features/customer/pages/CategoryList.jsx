import  { useEffect, useState } from 'react'
import api from '../../../api'
import { useDispatch, useSelector } from "react-redux";
import { setCategory, fetchProducts } from '../../../redux/productSlice'

function CategoryList() {
     const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();
const selected = useSelector((state) => state.products.category);
     useEffect(() => {
        fetchcategories();
  }, []);
  const fetchcategories = async()=>{
  const response =  await api.get("/admin/getactivecategories")
  setCategories(response.data)
  }


return (
  <div className="p-4">
    {/* Centered Heading */}
    <h2 className="text-2xl font-bold mb-6 text-center">Categories</h2>

    {/* Center Wrapper */}
    <div className="flex justify-center">
      <div
        className="
          flex gap-6 overflow-x-auto  no-scrollbar py-4 px-2
          sm:flex-wrap sm:overflow-visible sm:justify-center
          lg:grid lg:grid-cols-6 lg:gap-8
          max-w-6xl w-full
        "
      >
        {/* ALL BUTTON */}
        <button
          onClick={() => {
    dispatch(setCategory(null));
    dispatch(fetchProducts());
  }}
          className="flex flex-col items-center min-w-18 lg:min-w-0 group"
        >
          <div
            className={`
              w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center
              border-2 transition
              ${selected === null
                ? "border-teal-500 scale-105"
                : "border-gray-200 group-hover:border-gray-400"}
            `}
          >
            <span className="text-sm font-semibold">All</span>
          </div>
          <span className="text-xs lg:text-sm mt-2 font-medium">All</span>
        </button>

        {/* CATEGORY ITEMS */}
        {categories.map((cat) => (
          <button
            key={cat._id}
             onClick={() => {
    dispatch(setCategory(cat.name));
    dispatch(fetchProducts());
  }}
            className="flex flex-col items-center min-w-18 lg:min-w-0 group"
          >
          <div
  className={`
    w-16 h-16  lg:w-20 lg:h-20
    rounded-full overflow-hidden border-2
    transform transition-all duration-300 ease-out
    shadow-sm
    ${selected === cat.name
      ? "border-teal-500 scale-95 shadow-md ring-2 ring-teal-200"
      : "border-gray-200 group-hover:border-gray-400 group-hover:shadow-md group-hover:-translate-y-1"}
  `}
>
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-xs lg:text-sm mt-2 text-center font-medium">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

}

export default CategoryList