"use client";

import dynamic from "next/dynamic";

const ProspekteringView = dynamic(
  () => import("./ProspekteringView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#0f1629] text-gray-400">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-white/10 border-t-green-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Laster prospekteringsverktoy...</p>
        </div>
      </div>
    ),
  }
);

export default function ProspekteringWrapper() {
  return <ProspekteringView />;
}
