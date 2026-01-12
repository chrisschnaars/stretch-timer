import React, { useState } from "react";
import { useRoutine } from "../hooks/useRoutine";
import { Plus, Trash2, GripVertical, Check, X, Pencil } from "lucide-react";
import type { Stretch } from "../types";

interface RoutineEditorProps {
  routine: ReturnType<typeof useRoutine>;
}

const RoutineEditor: React.FC<RoutineEditorProps> = ({ routine }) => {
  const { stretches, updateStretches } = routine;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState(60);

  const startEditing = (stretch: Stretch) => {
    setEditingId(stretch.id);
    setEditName(stretch.name);
    setEditDuration(stretch.duration);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const newStretches = stretches.map((s) =>
      s.id === editingId ? { ...s, name: editName, duration: editDuration } : s
    );
    updateStretches(newStretches);
    setEditingId(null);
  };

  const removeStretch = (id: string) => {
    const newStretches = stretches.filter((s) => s.id !== id);
    updateStretches(newStretches);
  };

  const addStretch = () => {
    const newStretch: Stretch = {
      id: crypto.randomUUID(),
      name: "New Stretch",
      duration: 60,
    };
    updateStretches([...stretches, newStretch]);
  };

  const moveStretch = (index: number, direction: "up" | "down") => {
    const newStretches = [...stretches];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stretches.length) return;

    [newStretches[index], newStretches[targetIndex]] = [
      newStretches[targetIndex],
      newStretches[index],
    ];
    updateStretches(newStretches);
  };

  return (
    <div className="flex flex-col w-full py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Routine</h2>
        <button
          onClick={addStretch}
          className="bg-fg-primary text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {stretches.map((stretch, index) => (
          <div
            key={stretch.id}
            className={`bg-white border rounded-2xl p-4 flex flex-col transition-all ${
              editingId === stretch.id
                ? "border-fg-primary ring-1 ring-fg-primary shadow-md"
                : "border-neutral-200"
            }`}
          >
            {editingId === stretch.id ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-lg font-semibold bg-bg-primary p-2 rounded-lg outline-none border border-transparent focus:border-neutral-200"
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) =>
                      setEditDuration(parseInt(e.target.value) || 0)
                    }
                    className="w-full text-lg font-semibold bg-bg-primary p-2 rounded-lg outline-none border border-transparent focus:border-neutral-200"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={saveEdit}
                    className="bg-fg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <Check size={16} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveStretch(index, "up")}
                    disabled={index === 0}
                    className="disabled:opacity-20"
                  >
                    <GripVertical size={16} className="rotate-0" />
                  </button>
                  <button
                    onClick={() => moveStretch(index, "down")}
                    disabled={index === stretches.length - 1}
                    className="disabled:opacity-20"
                  >
                    <GripVertical size={16} className="rotate-0" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{stretch.name}</h3>
                  <p className="text-fg-muted text-sm">
                    {stretch.duration} seconds
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditing(stretch)}
                    className="p-2 text-neutral-400 hover:text-fg-primary transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => removeStretch(stretch.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {stretches.length === 0 && (
        <div className="text-center py-20 bg-white border border-dashed rounded-3xl border-neutral-300">
          <p className="text-neutral-400">Your routine is empty.</p>
          <button
            onClick={addStretch}
            className="mt-4 text-fg-primary font-bold underline"
          >
            Add your first stretch
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutineEditor;
