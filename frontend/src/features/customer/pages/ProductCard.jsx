import { useState } from "react";

function ProductCard({ product }) {
  const [qty, setQty] = useState(0);
  const outOfStock = product.stock === 0;

  return (
 
    <div
      className={`bg-white rounded-2xl shadow-sm p-3 group transition-all duration-300
      ${outOfStock ? "opacity-60 grayscale pointer-events-none" : "hover:shadow-xl hover:-translate-y-1"}`}
    >
      {/* image + discount */}
      <div className="relative overflow-hidden rounded-xl">
        {product.discountPercent > 0 && (
          <span className="absolute top-1 left-1 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md z-10 shadow">
            {product.discountPercent}% OFF
          </span>
        )}

        {outOfStock && (
          <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
            Out of Stock
          </span>
        )}

        <img
          src={product.images[0].url || product.images[0]}
          alt={product.name}
          className="h-45 w-full object-cover group-hover:scale-110 transition"
        />
      </div>

      <h3 className="mt-3 font-semibold text-(--dark-teal) line-clamp-2 min-h-12">
        {product.name}
      </h3>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-bold text-(--mid-teal)">
          ₹{product.discountedPrice}
        </span>
        {product.discountPercent > 0 && (
          <span className="text-sm text-gray-400 line-through">
            ₹{product.price}
          </span>
        )}
      </div>

      <div className="mt-3">
        {outOfStock ? (
          <button className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed">
            Stock Not Available
          </button>
        ) : qty === 0 ? (
          <button
            onClick={() => setQty(1)}
            className="w-full bg-(--dark-teal) text-white py-2 rounded-lg hover:bg-(--mid-teal)"
          >
            Add to Cart
          </button>
        ) : (
       <div className="flex items-center justify-between border border-(--secondary) rounded-xl overflow-hidden w-full">
  
  <button
    onClick={() => setQty(Math.max(0, qty - 1))}
    className="flex-1 py-2 text-lg font-bold text-(--dark-teal) bg-red-100 "
  >
    −
  </button>

  <span className="w-12 text-center font-semibold text-(--mid-teal) text-lg">
    {qty}
  </span>

  <button
    onClick={() => setQty(qty + 1)}
    className="flex-1 py-2 text-lg font-bold text-(--dark-teal) bg-green-100 "
  >
    +
  </button>

</div>

        )}
      </div>
    </div>
   
  );
}


export default ProductCard;
