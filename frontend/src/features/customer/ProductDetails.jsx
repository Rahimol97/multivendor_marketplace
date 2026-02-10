import { useNavigate,useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from '../../api'
import { ArrowLeftIcon,ShareIcon , HeartIcon as HeartOutline} from "@heroicons/react/24/outline";
import { StarIcon,HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
///add to cart
import { useDispatch,useSelector  } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { useAuth } from "../../components/context/AuthContext";



function ProductDetails() {
  const { id } = useParams();
   const navigate = useNavigate();
  const [product, setProduct] = useState(null);
 const [similar, setSimilar] = useState([]);
const [wishlisted, setWishlisted] = useState(false);



////for product adding cart
const dispatch = useDispatch();
const { user, customerId } = useAuth();
const cart = useSelector((state) => state.cart.cart);
const getId = (p) => (typeof p === "object" ? p._id : p);

const isInCart = product && cart?.items?.some(
  (item) => getId(item.product_id) === product._id
);
const handlebuynow = async () => {
   if (!user) {
    navigate("/");
    return;
  }
   if (!isInCart) {
   
  await dispatch(addToCart({
    user_id: user.user_id,
    customer_id: customerId,
    vendor_id: product.vendor_id,
    product_id: product._id,
    quantity: 1,
    price: product.discountedPrice,
    productName: product.name,
    images: product.images,
  }));
}
    navigate(`/customer/product/review/${product._id}`); 
};
  useEffect(() => {
   fetchproductbyid();
  }, [id]);
//////wishlist
const wishlist = async () => {
  try {
    if (wishlisted) {
      await api.delete(`/customer/wishlist/${product._id}`);
    } else {
      await api.post(`/customer/wishlist`, { productId: product._id });
    }
    setWishlisted(!wishlisted);
  } catch (err) {
    console.log(err);
  }
};
////share whatsap
const shareWhatsApp = () => {
  const url = `${window.location.origin}/customer/product/${product._id}`;
  const text = `Check out this product: ${product.name} - ₹${product.discountedPrice}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
};
  const fetchproductbyid =async()=>{
    try{
   const response = await api.get(`/vendor/product/id/${id}`)
   const prod = response.data.products;
   setProduct(prod);
   const similarresponse = await api.get(`/vendor/brandproducts?brand=${prod.brand}`)
 setSimilar(similarresponse.data.products.filter(p => p._id !== prod._id));

 const wishlistresponse = await api.get("/customer/wishlist");
 const wishlistItems = wishlistresponse.data.wishlist;

    const isWishlisted = wishlistItems.some(item => item.product._id === prod._id);
    setWishlisted(isWishlisted);
}
    catch(err){
        console.log(err.response.data)
    }
  }
  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className=" relative  p-4 max-w-6xl mx-auto">
      <button
        onClick={() => navigate("/customer")}
        className="fixed top-4 left-4 z-50 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
      </button>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        
        {/* Product Image */}
        <div>
          <img
            src={product.images[0].url || product.images[0]}
            alt={product.name}
            className="w-full rounded-2xl shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4 ">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

          <p className="text-gray-600">{product.description}</p>

          <p className="text-sm text-gray-500">Category: {product.category}</p>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-(--mid-teal)">
              ₹{product.discountedPrice}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="line-through text-gray-400">₹{product.price}</span>
                <span className="text-red-700 bg-red-100 font-semibold">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>
{/* rate */}
       <div className="flex items-center gap-1">
  {[1,2,3,4,5].map((star) => (
    <StarIcon
      key={star}
      className={`w-5 h-5 ${
        star <= Math.round(product.ratingAvg)
          ? "text-yellow-400"
          : "text-gray-300"
      }`}
    />
  ))}
  <span className="text-sm text-gray-500 ml-2">
    ({product.ratingCount} reviews)
  </span>
</div>
          {/* Wishlist + Share */}
          <div className="flex gap-4 text-xl">
<button onClick={wishlist} className="text-2xl">
  {wishlisted ? (
    <HeartSolid className="w-7 h-7 text-red-500" />
  ) : (
    <HeartOutline className="w-7 h-7 text-gray-600" />
  )}
</button>
<button
  onClick={shareWhatsApp}
  className="flex items-center gap-2 text-gray-600 hover:text-green-600"
>
  <ShareIcon className="w-5 h-5" />
  <span className="text-sm font-medium">Share</span>
</button>        
  </div>

          {/* Buy Button */}
          <button onClick={handlebuynow}  className="mt-4 bg-(--dark-teal) text-white py-3 rounded-xl text-lg hover:bg-(--mid-teal) cursor-pointer transition">
           Buy Now
          </button>
        </div>
 
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">More from {product.brand}</h2>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {similar.map(item => (
              <div
                key={item._id}
                onClick={() => navigate(`/customer/product/${item._id}`)}
                className="min-w-45 bg-white rounded-xl shadow cursor-pointer hover:shadow-md transition"
              >
                <img
                  src={item.images[0].url || item.images[0]}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-t-xl"
                />
                <div className="p-2">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-(--mid-teal) font-bold text-sm">₹{item.discountedPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
