import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useRoutines } from "../../hooks/useRoutines";
import { DEFAULT_DURATION, DEFAULT_REST_DURATION } from "../../constants";
import RoutineCard from "./RoutineCard";
import Button from "../ui/Button";

const RoutineList: React.FC = () => {
  const navigate = useNavigate();
  const { routines, addRoutine } = useRoutines();

  const handleAddRoutine = () => {
    const newRoutine = addRoutine({
      name: "New Routine",
      stretches: [
        {
          id: crypto.randomUUID(),
          name: "Jumping Jacks",
        },
      ],
      duration: DEFAULT_DURATION,
      restDuration: DEFAULT_REST_DURATION,
    });
    navigate(`/routine/${newRoutine.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)] font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <header className="flex justify-between items-center mb-8 pt-2">
          <h1 className="text-2xl font-bold tracking-tight">STRETCH</h1>
          <Button
            onClick={handleAddRoutine}
            icon={Plus}
            size="sm"
            aria-label="New Routine"
          />
        </header>

        {routines.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-bg-layer)] border border-dashed rounded-3xl border-[var(--color-border-default)]">
            <p className="text-[var(--color-fg-muted)] mb-4">
              No routines yet. Create your first routine to get started!
            </p>
            <button
              onClick={handleAddRoutine}
              className="text-[var(--color-fg-primary)] font-bold underline"
            >
              Create a routine
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {routines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineList;
