"use client";

import React, { useEffect, useState, useRef } from "react";

export default function TypewriterTitle({
  text,
  className = "",
  speed = 65,
  delay = 280,
  ...props
}) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const ref = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId = null;
    let intervalId = null;
    let cursorTimeoutId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (isTypingRef.current) return;
            isTypingRef.current = true;

            clearInterval(intervalId);
            clearTimeout(timeoutId);
            clearTimeout(cursorTimeoutId);

            setDisplayText("");
            setShowCursor(true);

            timeoutId = setTimeout(() => {
              let i = 0;
              intervalId = setInterval(() => {
                if (i <= text.length) {
                  setDisplayText(text.slice(0, i));
                  i++;
                } else {
                  clearInterval(intervalId);
                  cursorTimeoutId = setTimeout(() => {
                    setShowCursor(false);
                  }, 2000);
                }
              }, speed);
            }, delay);
          } else {
            // When completely out of view, reset so it re-types when scrolled back into view
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            clearTimeout(cursorTimeoutId);
            isTypingRef.current = false;
            setShowCursor(false);
            setDisplayText("");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      clearTimeout(cursorTimeoutId);
    };
  }, [text, speed, delay]);

  return (
    <div
      ref={ref}
      className={`section-title typewriter-title ${className}`}
      aria-label={text}
      {...props}
    >
      <span style={{ whiteSpace: "pre-line" }}>
        {displayText}
        {showCursor && <span className="typewriter-cursor">|</span>}
      </span>
    </div>
  );
}

