"use client";

import { cn } from "@/utils/cn";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";

export default function SpinnerLoadingOverlay({
  loading,
}: {
  loading: boolean;
}) {
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }

    // Cleanup function to ensure that overflow is reset when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-screen h-screen justify-between items-center bg-slate-500 opacity-50 box-border",
        loading ? "flex" : "hidden"
      )}
    >
      <ClipLoader
        loading={true}
        cssOverride={{ margin: "0 auto" }}
        aria-label="Loading Spinner"
        data-testid="loader"
        size={100}
      />
    </div>
  );
}
