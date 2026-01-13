import { useState } from "react";
import { useRoutine } from "./hooks/useRoutine";
import TimerView from "./components/Timer";
import RoutineEditor from "./components/RoutineEditor";
import Footer from "./components/Timer/Footer";
import { X, List } from "lucide-react";
import Button from "./components/ui/Button";

function App() {
  const [view, setView] = useState<"timer" | "editor">("timer");
  const routine = useRoutine();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)] font-sans p-4 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">STRETCH</h1>
        <Button
          aria-label={view === "timer" ? "Edit Routine" : "Show Timer"}
          onClick={() => setView(view === "timer" ? "editor" : "timer")}
          icon={view === "timer" ? List : X}
          size="sm"
        />
      </header>

      <main className="w-full max-w-md flex-1 flex flex-col">
        {view === "timer" ? (
          <TimerView routine={routine} />
        ) : (
          <RoutineEditor routine={routine} />
        )}
      </main>

      {view === "timer" && <Footer routine={routine} />}
    </div>
  );
}

export default App;
