"use client";

import dynamic from "next/dynamic";

const BoligtekstView = dynamic(
  () => import("./BoligtekstView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#0a0e1a] text-gray-400">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-white/10 border-t-[#c9a96e] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Laster boligtekst-generator...</p>
        </div>
      </div>
    ),
  }
);

export default function BoligtekstWrapper() {
  return <BoligtekstView />;
}
