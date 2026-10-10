import { Link } from "react-router-dom";
import { Layers } from "lucide-react";

function Logo({ light = false, large = false }) {
  const iconSize = large ? 44 : 22;
  const textSize = large ? "text-5xl" : "text-lg";
  const iconColor = light ? "text-violet-200" : "text-brand-500";
  const textColor = light ? "text-white" : "text-gray-900";
  const accentColor = light ? "text-violet-300" : "text-brand-500";

  return (
    <Link to="/" className="flex items-center gap-2">
      <Layers size={iconSize} className={iconColor} />
      <span className={`font-bold ${textSize} ${textColor}`}>
        Template<span className={accentColor}>Hub</span>
      </span>
    </Link>
  );
}

export default Logo;
