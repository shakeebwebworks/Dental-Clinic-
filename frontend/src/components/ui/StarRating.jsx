import { Star } from "lucide-react";

export default function StarRating({ rating = 5 }) {
  return (
    <div className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={18} fill={n <= rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}
