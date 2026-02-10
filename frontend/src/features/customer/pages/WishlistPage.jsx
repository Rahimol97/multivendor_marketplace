import { useEffect, useState } from "react";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { ArrowLeftIcon, HeartIcon as HeartOutline} from "@heroicons/react/24/outline";

import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import api from "../../../api";
import { fetchProducts } from '../../../redux/productSlice';

function WishlistPage() {
  const navigate = useNavigate();
    const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [wishlistIds, setWishlistIds] = useState([]);
  useEffect(() => {
    dispatch(fetchProducts()); 

  }, [dispatch]);

  //  Fetch wishlist on load
  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await api.get("/customer/wishlist");
      const ids = res.data.wishlist.map((item) => item.product._id);
     
      setWishlistIds(ids);
    };
    fetchWishlist();
  }, []);

  //  Filter products that are wishlisted
  const wishlistProducts = products.filter((p) =>
    wishlistIds.includes(p._id)
  );

  //  Remove from wishlist
  const removeWishlist = async (productId) => {
    await api.delete(`/customer/wishlist/${productId}`);
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <div className="bg-(--light-bg) min-h-screen p-4 pb-10">
      
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
        <div className="relative flex items-center justify-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 bg-white p-2 rounded-full shadow"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-lg">My Wishlist</h1>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4">
        {wishlistProducts.length === 0 && (
          <p className="col-span-2 text-center text-gray-500">
            Your wishlist is empty 
          </p>
        )}

        {wishlistProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/customer/product/${product._id}`)}
            className="bg-white rounded-xl shadow p-2 relative cursor-pointer hover:shadow-md transition"
          >
            {/* Wishlist Heart */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent navigation
                removeWishlist(product._id);
              }}
              className="absolute top-2 right-2"
            >
              <HeartSolid className="w-6 h-6 text-red-500" />
            </button>

            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-32 object-cover rounded-lg"
            />

            <div className="mt-2">
              <p className="text-sm font-medium line-clamp-2">
                {product.name}
              </p>
              <p className="text-[rgb(1,135,144)] font-bold mt-1">
                ₹{product.discountedPrice || product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
