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

  // Filter out routines without names
  const validRoutines = routines.filter((routine) => routine.name.trim());

  const getGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12; // Convert to 12-hour format, 0 becomes 12
    const displayMinutes = minutes.toString().padStart(2, "0");
    const timeString = `${displayHours}:${displayMinutes} ${period}`;
    return (
      <>
        Hey there. It's{" "}
        <span className="text-[var(--color-fg-accent)]">{timeString}</span>.
      </>
    );
  };

  const handleAddRoutine = () => {
    const newRoutine = addRoutine({
      name: "",
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
        <header className="pt-8 pb-12">
          <h1 className="sr-only">STRETCH</h1>
          <div className="text-3xl font-serif text-[var(--color-fg-primary)]">
            <p className="animate-[fadeIn_0.5s_ease-in-out]">{getGreeting()}</p>
            <p className="animate-[fadeIn_0.5s_ease-in-out_0.025s_both]">
              Time for a movement break.
            </p>
          </div>
        </header>

        <div>
          <div className="flex justify-between items-center mb-4 animate-[fadeIn_0.5s_ease-in-out_0.05s_both]">
            <h2 className="heading-md">Routines</h2>
            <Button
              onClick={handleAddRoutine}
              icon={Plus}
              size="sm"
              aria-label="Create new Routine"
            />
          </div>

          {validRoutines.length === 0 ? (
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
            <div className="flex flex-col gap-2">
              {validRoutines.map((routine, index) => (
                <div
                  key={routine.id}
                  style={{
                    animation: `fadeIn 0.5s ease-in ${
                      0.05 + index * 0.1
                    }s both`,
                  }}
                >
                  <RoutineCard routine={routine} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutineList;
