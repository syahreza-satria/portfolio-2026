"use client";

import Image from "next/image";
import SpotlightCard from "../SpotlightCard";

const EducationCard = ({ data }) => {
  return (
    <SpotlightCard className="custom-spotlight-card flex items-start gap-4 w-full" spotlightColor="rgba(0, 229, 255, 0.2)">
      <Image src={data.logo} width={80} height={80} alt={`${data.school} Logo`} className="hover:scale-110 transition duration-300" loading="eager" />

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0">
          <h3 className="font-medium text-lg">{data.school}</h3>
          <p className="text-neutral-400 text-sm flex gap-2">
            {data.title && <>{data.title}</>}
            {data.major && (
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
          {data.startDate} - {data.endDate}
          <span className="text-neutral-600">•</span>
          {data.location}
        </p>
      </div>
    </SpotlightCard>
  );
};

export default EducationCard;
