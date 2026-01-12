import React, { useState } from "react";
import { useRoutine } from "../hooks/useRoutine";
import { Plus, Trash2, GripVertical, Pencil } from "lucide-react";
import type { Stretch } from "../types";
import Button from "./ui/Button";

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
        <Button
          onClick={addStretch}
          icon={Plus}
          size="sm"
          aria-label="Add Stretch"
        />
      </div>

      <div className="space-y-3">
        {stretches.map((stretch, index) => (
          <div
            key={stretch.id}
            className={`group bg-[var(--color-bg-layer)] border border-[var(--color-border-default)] rounded-2xl p-4 flex flex-col transition-all ${
              editingId === stretch.id && " shadow-lg"
            }`}
          >
            {editingId === stretch.id ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-lg font-semibold bg-transparent p-2 rounded-lg outline-none border border-[var(--color-border-default)]"
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) =>
                      setEditDuration(parseInt(e.target.value) || 0)
                    }
                    className="w-full text-lg font-semibold bg-transparent p-2 rounded-lg outline-none border border-[var(--color-border-default)]"
                  />
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex justify-end gap-2 pt-2">
                    <Button onClick={saveEdit} size="sm" kind="primary">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      size="sm"
                      kind="default"
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button
                    onClick={() => removeStretch(stretch.id)}
                    icon={Trash2}
                    size="sm"
                    destructive
                  />
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
                  <p className="text-[var(--color-fg-muted)] text-sm">
                    {stretch.duration} seconds
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    className="md:opacity-0 focus:opacity-100 group-hover:opacity-100 transition-opacity"
                    onClick={() => startEditing(stretch)}
                    icon={Pencil}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {stretches.length === 0 && (
        <div className="text-center py-20 bg-[var(--color-bg-layer)] border border-dashed rounded-3xl border-[var(--color-border-default)]">
          <p className="text-[var(--color-fg-muted)]">Your routine is empty.</p>
          <button
            onClick={addStretch}
            className="mt-4 text-[var(--color-fg-primary)] font-bold underline"
          >
            Add your first stretch
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutineEditor;
