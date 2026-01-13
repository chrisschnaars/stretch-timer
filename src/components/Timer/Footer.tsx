import React from "react";
import { useRoutine } from "../../hooks/useRoutine";

interface FooterProps {
  routine: ReturnType<typeof useRoutine>;
}

const Footer: React.FC<FooterProps> = ({ routine }) => {
  const { currentIndex, stretches } = routine;

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

      <div className="flex flex-col items-center">
        <div className="flex items-center">
          {currentIndex < stretches.length - 1 && (
            <p className="text-[var(--color-fg-muted)] text-sm font-medium">
              Next:{" "}
              <span className="text-[var(--color-fg-primary)] font-bold">
                {stretches[currentIndex + 1].name}
              </span>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
