import { useEffect, useState } from "react";

function Toast({ message, type = "success", onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // wait for animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 w-[320px]
      transition-all duration-300 ease-out
      ${show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
    `}
    >
      <div
        className={`relative flex items-start gap-3 bg-white rounded-xl shadow-xl px-4 py-3 border
          ${type === "success" ? "border-green-200" : "border-red-200"}
        `}
      >
        {/* Left Accent Bar */}
        <div
          className={`w-1 rounded-full self-stretch
            ${type === "success" ? "bg-green-500" : "bg-red-500"}
          `}
        />

        {/* Icon */}
        <span className="text-lg">
          {type === "success" ? "✅" : "⚠️"}
        </span>

        {/* Message */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">
            {type === "success" ? "Success" : "Error"}
          </p>
          <p className="text-sm text-slate-600">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          className="text-slate-400 hover:text-slate-700 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
