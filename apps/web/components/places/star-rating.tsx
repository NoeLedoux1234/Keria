import { useId } from "react";

function StarIcon({
  filled,
  half,
  size,
  gradientId,
}: {
  filled?: boolean;
  half?: boolean;
  size: number;
  gradientId?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {half && gradientId ? (
        <>
          <defs>
            <linearGradient id={gradientId}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#${gradientId})`}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-keria-gold"
          />
        </>
      ) : (
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={filled ? "text-keria-gold" : "text-keria-forest"}
        />
      )}
    </svg>
  );
}

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const uniqueId = useId();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const iconSize = size === "lg" ? 20 : 14;

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Note : ${rating.toFixed(1)} sur 5`}
    >
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`full-${i}`} filled size={iconSize} />
      ))}
      {hasHalfStar ? (
        <StarIcon key="half" half size={iconSize} gradientId={`halfStar-${uniqueId}`} />
      ) : null}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarIcon key={`empty-${i}`} size={iconSize} />
      ))}
    </div>
  );
}
