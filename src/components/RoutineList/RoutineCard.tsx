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

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) {
      return "less than a minute";
    }
    const roundedMinutes = Math.round(totalSeconds / 60);
    return `${roundedMinutes} ${roundedMinutes === 1 ? "min" : "mins"}`;
  };

  return (
    <div className="relative bg-[var(--color-bg-layer)] border border-[var(--color-border-default)] rounded-2xl p-5 hover:shadow-sm transition-all group">
      <button
        className="absolute inset-0 rounded-2xl hover:cursor-pointer"
        onClick={handleCardClick}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="heading-md mb-1/2 truncate">{routine.name}</h2>
          <div className="flex items-center gap-2 text-md text-[var(--color-fg-muted)]">
            <p>
              {routine.stretches.length} stretch
              {routine.stretches.length === 1 ? "" : "es"}
            </p>
            <span>•</span>
            <p>{formatDuration(totalWithRest)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={handleEdit}
            icon={SquarePen}
            size="sm"
            className="relative md:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            aria-label="Edit routine"
          />
        </div>
      </div>
    </div>
  );
};

export default RoutineCard;
