import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DynamicIsland = ({ forceExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle force expansion from parent
  useEffect(() => {
    setIsExpanded(forceExpanded);
  }, [forceExpanded]);

  const tabs = [
    { id: "home", label: "Home", path: "/" },
    { id: "presentation", label: "Presentation", path: "/presentation" },
    { id: "demo", label: "Demo", path: "/demo" },
    { id: "about", label: "About", path: "/about" },
  ];

  const activeTab =
    tabs.find((tab) => tab.path === location.pathname)?.id || "home";

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-50">
      <div
        className={`
          relative overflow-hidden bg-black/90 backdrop-blur-xl rounded-[2rem]
          transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]

          shadow-2xl border border-white/10
          ${
            isExpanded
              ? "px-6 py-6 w-[480px]"
              : "px-6 py-3 w-[140px] cursor-pointer"
          }
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => !forceExpanded && setIsExpanded(false)}
      >
        {/* Compact State */}
        <div
          className={`
            flex items-center justify-center gap-2
            transition-all duration-700
            ${isExpanded ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          `}
        >
          <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
          <span className="text-white/80 text-sm font-medium">Menu</span>
        </div>

        {/* Expanded State */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center gap-2 px-4
            transition-all duration-700
            ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          `}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                relative px-6 py-3 rounded-full font-medium text-sm
                transition-all duration-500 ease-out
                ${
                  activeTab === tab.id
                    ? "text-white bg-white/20 scale-105"
                    : "text-white/60 hover:text-white/90 hover:bg-white/10 hover:scale-105"
                }
              `}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
              }}
            >
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute inset-0 rounded-full bg-blue-950 animate-pulse" />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Animated glow effect */}
        <div
          className={`
            absolute inset-0 -z-10 blur-2xl opacity-50
            bg-black
            transition-opacity duration-500
            ${isExpanded ? "opacity-30" : "opacity-0"}
          `}
        />
      </div>
    </div>
  );
};

export default DynamicIsland;
