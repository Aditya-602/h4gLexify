import { Box } from "lucide-react";
import DemoAnimation from "../components/DemoAnimation";
import { LayoutTextFlip } from "../components/LayoutTextFlip";


export default function Home() {
  return (
    <div className="relative z-10 w-full min-h-screen px-8 py-20 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Side: Title & Subtitle */}
        <div className="flex-1 text-center lg:text-left space-y-4 pointer-events-auto">
          
          {/* 1. Header: Now just Icon + Lexify */}
          <h1 className="flex items-center justify-center lg:justify-start gap-x-3 text-5xl md:text-7xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 drop-shadow-sm leading-tight animate-fadeInScale">
            <Box
              className="w-10 h-10 md:w-14 md:h-14 text-primary shrink-0"
              strokeWidth={2.5}
            />
            <span>Lexify</span>
          </h1>

          {/* 2. Highlighted Text: "IT JUST WORKS!" */}
          
          
          {/* 3. Flipping Text: Now placed at the bottom */}
          <div 
            className="text-primary font-semibold text-xl mt-8 md:text-lg opacity-0 animate-fadeInUp"
            style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
          >
            <LayoutTextFlip
              text=""
              words={[
                "Simple",
                "Easy to use",
                "One Click Result",
                "Nothing Fancy",
              ]}
            />
          </div>

          <h1 className="flex items-center justify-center mt-10 lg:justify-start gap-x-3 text-2xl font-extrabold tracking-tight text-neutral-900 drop-shadow-sm leading-tight animate-fadeInScale">
            <span>IT JUST WORKS. </span>
          </h1>
        </div>

        {/* Right Side: Animated Demo Sequence */}
        <div
          className="flex-1 w-full flex justify-center lg:justify-end pointer-events-auto opacity-0 animate-fadeInUp"
          style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}
        >
          <div className="w-full max-w-xl">
            <DemoAnimation />
          </div>
        </div>
      </div>
    </div>
  );
}