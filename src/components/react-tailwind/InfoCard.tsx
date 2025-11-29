"use client";
import { useState } from "react";

interface InfoCardProps {
  image: string;
  headline: string;
  smallText: string;
  description: string;
  imageDescription: string;
}

export default function InfoCard({
  image,
  headline,
  smallText,
  description,
  imageDescription,
}: InfoCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`
        relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 min-h-80
        w-full max-w-sm mx-auto transition-colors duration-700 ease-in-out md:min-h-75 lg:min-h-90
      `}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={imageDescription}
        className={`
          absolute inset-0 h-full w-full object-cover
          transition-opacity duration-700 ease-in-out
          ${expanded ? "opacity-0" : "opacity-100"}
        `}
      />
      <div
        className={`
          absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40
          transition-opacity duration-700 ease-in-out
          ${expanded ? "opacity-0" : "opacity-100"}
        `}
      ></div>

      {/* Info Icon */}
      <span
        className={`
          w-10 h-10 cursor-pointer z-10 transition-opacity duration-500 ease-in-out
          ${expanded ? "" : "opacity-100"}
          absolute top-4 right-4
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`bi bi-info-circle-fill w-full h-full ${
            expanded ? "fill-white" : `fill-black`
          }`}
          viewBox="0 0 16 16"
        >
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
        </svg>
      </span>

      {/* Title */}
      <h3
        className={`
          z-10 mt-3 text-3xl font-bold text-white text-left
          transition-transform duration-700 ease-in-out
          ${expanded ? "-translate-y-6" : "translate-y-0"}
        `}
      >
        {headline}
      </h3>

      {/* Short Text */}
      <div
        className={`
          z-10 gap-y-1 text-sm leading-6 text-left
          transition-transform duration-700 ease-in-out
          ${expanded ? "-translate-y-6 text-white" : "translate-y-0 text-gray-300"}
        `}
      >
        {smallText}
      </div>

      {/* Hidden Description */}
      <div
        className={`
          z-10 text-sm leading-6 text-left transition-all duration-700 ease-in-out
          ${expanded ? "opacity-100 max-h-96 mt-2 text-white" : "opacity-0 max-h-0 mt-0 overflow-hidden"}
        `}
      >
        {description}
      </div>
    </article>
  );
}