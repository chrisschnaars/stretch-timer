import React, { useState, useEffect, useRef } from "react";
import { useRoutine } from "../../hooks/useRoutine";

interface FooterProps {
  routine: ReturnType<typeof useRoutine>;
}

const MOTIVATIONAL_MESSAGES = ["Last one!", "You can do it!", "Nearly there!"];

const Footer: React.FC<FooterProps> = ({ routine }) => {
  const { currentIndex, stretches, duration } = routine;
  const isLastStretch = currentIndex === stretches.length - 1;
  const wasLastStretch = useRef(false);

  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isLastStretch) {
      wasLastStretch.current = false;
      setMessageIndex(0);
      setIsVisible(true);
      return;
    }

    // Track when we enter the last stretch
    if (!wasLastStretch.current) {
      wasLastStretch.current = true;
    }

    // Calculate time per message based on stretch duration
    const timePerMessage = (duration / MOTIVATIONAL_MESSAGES.length) * 1000; // Convert to milliseconds
    let currentMessageIndex = 0;

    // Cycle through messages on last stretch
    const interval = setInterval(() => {
      currentMessageIndex++;

      // Stop after showing all messages
      if (currentMessageIndex >= MOTIVATIONAL_MESSAGES.length) {
        clearInterval(interval);
        return;
      }

      // Fade out
      setIsVisible(false);

      // After fade out, change message and fade back in
      setTimeout(() => {
        setMessageIndex(currentMessageIndex);
        setIsVisible(true);
      }, 500); // Match transition duration
    }, timePerMessage);

    return () => clearInterval(interval);
  }, [isLastStretch, duration]);

  return (
    <footer className="w-full max-w-md mt-auto space-y-4 pb-4">
      <div className="flex justify-center gap-2">
        {stretches.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-[var(--color-bg-accent)]"
                : "bg-[var(--color-bg-muted)]"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col items-center min-h-[24px]">
        <div className="flex items-center">
          {currentIndex < stretches.length - 1 ? (
            <p className="text-[var(--color-fg-muted)] text-sm font-medium">
              Next:{" "}
              <span className="text-[var(--color-fg-primary)] font-bold">
                {stretches[currentIndex + 1].name}
              </span>
            </p>
          ) : (
            <p
              className="text-[var(--color-fg-primary)] text-sm font-medium transition-opacity duration-500"
              style={{ opacity: isVisible ? 1 : 0 }}
            >
              {MOTIVATIONAL_MESSAGES[messageIndex]}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
