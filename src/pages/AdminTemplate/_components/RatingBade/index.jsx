// ===== BASE =====
const BASE_CLASSES =
    "inline-flex items-center gap-1 rounded-full font-medium";

// ===== SIZE =====
const SIZE_CLASSES = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
};

// ===== SOLID COLORS =====
const SOLID_COLORS = {
    default: "bg-gray-100 text-gray-500",
    high: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-red-100 text-red-700",
};

// ===== OUTLINE COLORS =====
const OUTLINE_COLORS = {
    default: "border border-gray-300 text-gray-600",
    high: "border border-green-500 text-green-600",
    medium: "border border-yellow-500 text-yellow-600",
    low: "border border-red-500 text-red-600",
};

// ===== LOGIC =====
const getRatingVariant = (value) => {
    const rating = Number(value);

    if (value == null || value === "" || Number.isNaN(rating)) {
        return "default";
    }

    if (rating >= 8) return "high";
    if (rating >= 5) return "medium";
    return "low";
};

const formatRating = (value) => {
    const rating = Number(value);
    if (value == null || value === "" || Number.isNaN(rating)) return "—";
    return `${rating}/10`;
};

// ===== COMPONENT =====
export default function RatingBadge({
    value,
    size = "sm",
    variant = "solid", 
    className = "",
}) {
    const ratingVariant = getRatingVariant(value);

    const colorClass =
        variant === "outline"
            ? OUTLINE_COLORS[ratingVariant]
            : SOLID_COLORS[ratingVariant];

    return (
        <span
            className={`
                ${BASE_CLASSES}
                ${SIZE_CLASSES[size]}
                ${colorClass}
                ${className}
            `}
        >
            {formatRating(value)}
        </span>
    );
}