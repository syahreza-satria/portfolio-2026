"use client";

import { useEffect, useState } from "react";
import SpotlightCard from "../SpotlightCard";

import { GitHubCalendar } from "react-github-calendar";

const GithubCalendar = ({ username = "syahreza-satria" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const customTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#27272a", "#064e3b", "#047857", "#10b981", "#34d399"],
  };

  return (
    <SpotlightCard
      className="custom-spotlight-card w-full relative group"
      spotlightColor="rgba(16, 185, 129, 0.2)"
    >
      <div className="overflow-x-auto w-full scrollbar-hide py-2 flex justify-center">
        <div className="min-w-[750px] md:min-w-full flex justify-center">
          {mounted ? (
            <GitHubCalendar
              username={username}
              theme={customTheme}
              colorScheme="dark"
              style={{
                color: "#e5e5e5",
              }}
              labels={{
                totalCount: "{{count}} contributions in the last year",
              }}
            />
          ) : (
            <div className="h-[150px] w-full flex items-center justify-center text-neutral-500 animate-pulse text-sm">
              Loading GitHub contributions...
            </div>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default GithubCalendar;
