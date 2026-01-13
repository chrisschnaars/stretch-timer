import React from "react";
import { useNavigate } from "react-router-dom";
import { SquarePen } from "lucide-react";
import type { Routine } from "../../types";
import Button from "../ui/Button";

interface RoutineCardProps {
  routine: Routine;
}

const RoutineCard: React.FC<RoutineCardProps> = ({ routine }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/routine/${routine.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/routine/${routine.id}/edit`);
  };

  const totalDuration = routine.stretches.length * routine.duration;
  const totalWithRest =
    totalDuration + (routine.stretches.length - 1) * routine.restDuration;
  const minutes = Math.floor(totalWithRest / 60);
  const seconds = totalWithRest % 60;

  return (
    <div className="relative bg-[var(--color-bg-layer)] border border-[var(--color-border-default)] rounded-2xl p-6 cursor-pointer hover:shadow-sm transition-all group">
      <button
        className="absolute inset-0 rounded-2xl"
        onClick={handleCardClick}
      ></button>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold mb-1 truncate">{routine.name}</h2>
          <div className="flex items-center gap-2 text-md text-[var(--color-fg-muted)]">
            <p>{routine.stretches.length} stretches</p>
            <span>•</span>
            <p>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={handleEdit}
            icon={SquarePen}
            size="sm"
            className="md:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            aria-label="Edit routine"
          />
        </div>
      </div>
    </div>
  );
};

export default RoutineCard;
