"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { generateSvgPlaceholder, getValidImageUrl } from "@/lib/utils/imageHelper";

/**
 * OptimizedImage
 * High-performance wrapper around Next.js Image.
 * - Parent element provides the placeholder background (no JS loading state needed)
 * - Falls back to transport-specific SVG on error
 * - fetchpriority="high" + eager when priority=true
 */
export default function OptimizedImage({
  ticket,
  alt,
  className,
  sizes = "100vw",
  fill = true,
  quality = 75,
  priority = false,
  unoptimized = false,
}) {
  const [imgSrc, setImgSrc] = useState(() => getValidImageUrl(ticket));

  useEffect(() => {
    const next = getValidImageUrl(ticket);
    if (next !== imgSrc) {
      setImgSrc(next);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.image, ticket?._id, ticket?.type]);

  const handleError = () => {
    const fallback = generateSvgPlaceholder(ticket?.type);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || ticket?.title || "Ticket Image"}
      fill={fill}
      sizes={sizes}
      quality={quality}
      className={className}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      unoptimized={unoptimized}
      onError={handleError}
    />
  );
}
