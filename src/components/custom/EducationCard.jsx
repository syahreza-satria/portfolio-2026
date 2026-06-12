"use client";

import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import SpotlightCard from "../SpotlightCard";

const EducationCard = ({ data, onEdit, onDelete }) => {
  const formatMonthYear = (dateString) => {
    if (!dateString) return "Present"; // Atur teks default jika endDate kosong/null

    const date = new Date(dateString);

    // Mencegah error jika format tanggal dari database tidak valid
    if (isNaN(date)) return dateString;

    return date.toLocaleDateString("en-US", {
      month: "short", // Gunakan "long" untuk "January", atau "short" untuk "Jan"
      year: "numeric",
    });
  };
  return (
    <SpotlightCard className="custom-spotlight-card flex items-start gap-4 w-full relative group" spotlightColor="rgba(0, 229, 255, 0.2)">
      {(onEdit || onDelete) && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur transition-all cursor-pointer"
              title="Edit Education"
            >
              <Edit className="size-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 rounded-lg bg-neutral-900/80 hover:bg-red-950/80 text-neutral-300 hover:text-red-450 border border-neutral-800 hover:border-red-900 backdrop-blur transition-all cursor-pointer"
              title="Delete Education"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      )}
      <Image src={data.logo} width={80} height={80} alt={`${data.school} Logo`} className="hover:scale-110 transition duration-300" loading="eager" />

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0">
          <h3 className="font-medium text-lg">{data.school}</h3>
          <p className="text-neutral-400 text-sm flex gap-2">
            {(data.degree || data.title) && <>{data.degree || data.title}</>}
            {(data.major) && (
              <>
                <span className="text-neutral-600">•</span>
                {data.major}
              </>
            )}
            {data.gpa && (
              <>
                <span className="text-neutral-600">•</span>
                GPA: {data.gpa} /4.00
              </>
            )}
          </p>
        </div>
        <p className="text-neutral-400 text-sm flex gap-2">
          {formatMonthYear(data.start_date)} - {formatMonthYear(data.end_date)}
          <span className="text-neutral-600">•</span>
          {data.location}
        </p>
      </div>
    </SpotlightCard>
  );
};

export default EducationCard;
