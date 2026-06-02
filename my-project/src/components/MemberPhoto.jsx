import React from "react";
import assetUrl from "../utils/assetUrl";

export default function MemberPhoto({
  name,
  profileImage,
  size = "md",
  className = "",
}) {
  const src = assetUrl(profileImage);
  const sizes = {
    sm: "w-16 h-20 text-xl",
    md: "w-20 h-24 text-3xl",
    lg: "w-28 h-32 text-4xl",
    xl: "w-32 h-32 text-4xl rounded-full",
  };
  const box = sizes[size] || sizes.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Member"}
        className={`${box} object-cover rounded-lg shrink-0 bg-gray-100 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${box} rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-800 shrink-0 ${className}`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}
