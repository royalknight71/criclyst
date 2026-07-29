import React from "react";

function StatItem({ icon: Icon, title, value }) {
  return (
    <div
      className="
        flex flex-col items-center
        rounded-xl
        border border-gray-200
        bg-gray-50
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500
        hover:bg-white
        hover:shadow-lg
      "
    >
      {/* Icon */}
      <div className="mb-2 text-2xl text-blue-600">
        <Icon />
      </div>

      {/* Value */}
      <h3 className="text-xl font-bold text-gray-900">
        {value ?? "—"}
      </h3>

      {/* Title */}
      <p className="mt-1 text-sm font-medium text-gray-500">
        {title}
      </p>
    </div>
  );
}

export default StatItem;