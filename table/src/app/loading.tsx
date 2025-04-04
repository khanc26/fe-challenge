"use client";

import { ClipLoader } from "react-spinners";
import { CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

export default function HomeLoading() {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex justify-between items-center bg-slate-500 opacity-50">
      <ClipLoader
        loading={true}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
        size={100}
      />
    </div>
  );
}
