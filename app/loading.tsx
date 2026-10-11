import Image from "next/image";
import appIcon from "./icon.png";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-neutral-950 text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Spinner Ring around Logo */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Outer spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 border-r-amber-400 animate-spin" />
          
          {/* Subtle inner pulse ring */}
          <div className="absolute inset-2 rounded-full border border-orange-500/30 animate-ping opacity-25" />

          {/* Centered Logo */}
          <div className="w-12 h-12 flex items-center justify-center relative">
            <Image
              src={appIcon}
              alt="Front Runner"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <div className="text-xs font-black tracking-[0.25em] text-orange-500 uppercase">
            Front Runner
          </div>
          <div className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mt-1">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}
