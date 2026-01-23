import React from "react";

const FormatDate = ({ date, format = "dd-mm-yyyy", showTime = true }) => {
  if (!date) return "Never logged in";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  // ✅ Time
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 to 12
  hours = String(hours).padStart(2, "0");

  let formattedDate = "";
  if (format === "dd-mm-yyyy") formattedDate = `${dd}-${mm}-${yyyy}`;
  else if (format === "yyyy-mm-dd") formattedDate = `${yyyy}-${mm}-${dd}`;
  else formattedDate = d.toLocaleDateString();

  // ✅ If time needed
  if (showTime) {
    return (
      <span>
        {formattedDate} {hours}:{minutes}:{seconds} {ampm}
      </span>
    );
  }

  return <span>{formattedDate}</span>;
};

export default FormatDate;
