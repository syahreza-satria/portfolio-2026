"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PageTransitionLoader = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleLinkClick = (e) => {
      // Find closest anchor tag
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Check if it's an internal link
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        target !== "_blank" &&
        !e.defaultPrevented &&
        e.button === 0 && // Left click only
        !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey // No modifier keys
      ) {
        // Prevent default navigation
        e.preventDefault();

        // If clicking current path, do nothing
        if (href === window.location.pathname) return;

        // Start transition animation
        setIsPending(true);
        setProgress(0);

        let startTimestamp = null;
        const duration = 750; // Transition duration in ms

        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const elapsed = timestamp - startTimestamp;
          const progressVal = Math.min((elapsed / duration) * 100, 100);
          setProgress(Math.floor(progressVal));

          if (elapsed < duration) {
            window.requestAnimationFrame(step);
          } else {
            // Trigger actual navigation
            router.push(href);
            // Small timeout to allow Next.js hydration of the new page before hiding loader
            setTimeout(() => {
              setIsPending(false);
            }, 200);
          }
        };

        window.requestAnimationFrame(step);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [router]);

  return (
    <AnimatePresence>
      {isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-lg select-none"
        >
          {/* Centered Loading Status */}
          <div className="flex flex-col items-center gap-4">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
              className="text-6xl font-bold font-mono text-white tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {progress}%
            </motion.span>

            {/* Premium Loading Progress Slider */}
            <div className="w-64 h-1.5 bg-neutral-850 rounded-full overflow-hidden border border-neutral-800/80">
              <motion.div
                className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                style={{ width: `${progress}%` }}
                layoutId="loaderProgress"
              />
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs font-semibold text-emerald-400/80 uppercase tracking-widest mt-2 animate-pulse"
            >
              Navigating
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransitionLoader;
