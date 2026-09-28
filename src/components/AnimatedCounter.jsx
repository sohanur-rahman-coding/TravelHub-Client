"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0, duration = 2 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const target = parseFloat(value);
    if (isNaN(target)) return;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = easedProgress * target;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    }

    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  const formattedNumber = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.floor(displayValue).toLocaleString();

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}
