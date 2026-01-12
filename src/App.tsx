import { useState } from "react";
import { useRoutine } from "./hooks/useRoutine";
import TimerView from "./components/TimerView";
import RoutineEditor from "./components/RoutineEditor";
import TimerFooter from "./components/TimerFooter";
import { X, List } from "lucide-react";

function App() {
  const [view, setView] = useState<"timer" | "editor">("timer");
  const routine = useRoutine();

  return (
    <div className="min-h-screen bg-bg-primary text-fg-primary font-sans p-4 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">STRETCH</h1>
        <button
          onClick={() => setView(view === "timer" ? "editor" : "timer")}
          className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
        >
          {view === "timer" ? <List size={24} /> : <X size={24} />}
        </button>
      </header>

      <main className="w-full max-w-md flex-1 flex flex-col">
        {view === "timer" ? (
          <TimerView routine={routine} />
        ) : (
          <RoutineEditor routine={routine} />
        )}
      </main>

      {view === "timer" && <TimerFooter routine={routine} />}
    </div>
  );
}

export default App;
