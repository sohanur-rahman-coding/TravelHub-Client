"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollReveal({ children, className = "", delay = 0, yOffset = 50, duration = 0.8, stagger = 0 }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const elements = gsap.utils.toArray(containerRef.current.children);
    if (!elements.length) return;
    
    gsap.fromTo(elements, 
      { opacity: 0, y: yOffset },
      {
        y: 0,
        opacity: 1,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 95%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
