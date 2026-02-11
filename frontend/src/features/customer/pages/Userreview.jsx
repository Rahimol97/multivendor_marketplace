import React,{ useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { StarIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function Userreview() {
    const { orderid, productid } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  
  const submitReview = async () => {
    if (rating === 0) return alert("Please select a rating");

    await api.post("/customer/addreview", {
      orderId: orderid,
      productId:productid,
      rating,
      comment,
    });

    alert("Review submitted!");
    navigate(-1);
  };
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
         <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
           <div className="relative flex items-center justify-center h-14 px-4">
         
             {/* Back Button  */}
             <button
               onClick={() => navigate(-1)}
               className="absolute left-4 bg-white p-2 rounded-full shadow"
             >
               <ArrowLeftIcon className="w-6 h-6" />
             </button>
         
            
           </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Rate Product</h2>

        {/* ⭐ Stars */}
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map((star) => (
            <StarIcon
              key={star}
              className={`w-8 h-8 cursor-pointer transition ${
                (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

        {/* Comment */}
        <textarea
          className="w-full border border-slate-100 rounded-md p-2 mb-4"
          rows="3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={submitReview}
          className="w-full bg-(--accent) text-white py-2 rounded-md font-semibold"
        >
          Submit Review
        </button>
      </div>
   </div>
  )
}
export default Userreview