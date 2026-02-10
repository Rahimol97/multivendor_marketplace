import { motion } from "framer-motion";

const statussteps = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered"
];

function OrderProgress({ currentStatus }) {
  const isCancelled = currentStatus === "cancelled";
  const currentIndex = statussteps.indexOf(currentStatus);

  return (
    <div className="relative mt-8 px-2">
      {/* Background Line */}
      <div className="absolute top-3 left-0 right-0 h-1 bg-gray-300 rounded" />

      {/* Animated Progress Line */}
      {!isCancelled && currentIndex >= 0 && (
        <motion.div
          className="absolute top-3 left-0 h-1 bg-green-600 rounded"
          initial={{ width: 0 }}
          animate={{
            width: `${(currentIndex / (statussteps.length - 1)) * 100}%`
          }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Cancel Line */}
      {isCancelled && (
        <motion.div
          className="absolute top-3 left-0 h-1 bg-red-500 rounded"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.4 }}
        />
      )}

      <div className="flex justify-between relative z-10">
        {statussteps.map((step, index) => {
          const isCompleted = index <= currentIndex;

          return (
            <div key={step} className="flex flex-col items-center w-16 text-center">
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold
                  ${
                    isCancelled
                      ? "bg-red-500"
                      : isCompleted
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                initial={{ scale: 0.7 }}
                animate={{ scale: isCompleted || isCancelled ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 15 }}
              >
                {isCancelled ? "✕" : isCompleted ? "✓" : ""}
              </motion.div>

              <span
                className={`text-xs mt-2 capitalize ${
                  isCancelled
                    ? "text-red-500 font-semibold"
                    : isCompleted
                    ? "text-green-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cancel */}
      {isCancelled && (
        <motion.p
          className="text-center text-red-600 font-semibold mt-6"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Order Cancelled ❌
        </motion.p>
      )}
    </div>
  );
}

export default OrderProgress;
