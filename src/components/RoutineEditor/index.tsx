import React, { useState } from "react";
import { useRoutine } from "../../hooks/useRoutine";
import { Plus } from "lucide-react";
import type { Stretch } from "../../types";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import SliderInput from "../ui/SliderInput";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { StretchItem, SortableStretch } from "./StretchItem";

interface RoutineEditorProps {
  routine: ReturnType<typeof useRoutine>;
}

const RoutineEditor: React.FC<RoutineEditorProps> = ({ routine }) => {
  const {
    name,
    updateName,
    stretches,
    updateStretches,
    duration,
    updateDuration,
  } = routine;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const startEditing = (stretch: Stretch) => {
    setEditingId(stretch.id);
    setEditName(stretch.name);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    const newStretches = stretches.map((s) =>
      s.id === editingId ? { ...s, name: editName.trim() } : s
    );
    updateStretches(newStretches);
    setEditingId(null);
  };

  const cancelEdit = () => {
    if (editingId) {
      const stretch = stretches.find((s) => s.id === editingId);
      if (stretch && !stretch.name.trim()) {
        removeStretch(editingId);
      }
    }
    setEditingId(null);
  };

  const removeStretch = (id: string) => {
    const newStretches = stretches.filter((s) => s.id !== id);
    updateStretches(newStretches);
  };

  const addStretch = () => {
    const newId = crypto.randomUUID();
    const newStretch: Stretch = {
      id: newId,
      name: "",
    };
    updateStretches([...stretches, newStretch]);
    setEditingId(newId);
    setEditName(newStretch.name);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stretches.findIndex((s) => s.id === active.id);
      const newIndex = stretches.findIndex((s) => s.id === over.id);

      updateStretches(arrayMove(stretches, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const activeStretch = activeId
    ? stretches.find((s) => s.id === activeId)
    : null;

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

      <div className="space-y-6 mb-8">
        <TextInput
          label="Routine Name"
          value={name}
          onChange={(e) => updateName(e.target.value)}
        />

        <SliderInput
          label="Global Stretch Duration"
          min={1}
          max={90}
          value={duration}
          onChange={updateDuration}
        />
      </div>

      {stretches.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-bg-layer)] border border-dashed rounded-3xl border-[var(--color-border-default)]">
          <p className="text-[var(--color-fg-muted)]">Your routine is empty.</p>
          <button
            onClick={addStretch}
            className="mt-4 text-[var(--color-fg-primary)] font-bold underline"
          >
            Add your first stretch
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Routine</div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={stretches.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {stretches.map((stretch, index) => (
                  <SortableStretch
                    key={stretch.id}
                    stretch={stretch}
                    index={index}
                    editingId={editingId}
                    editName={editName}
                    setEditName={setEditName}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                    removeStretch={removeStretch}
                    startEditing={startEditing}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {activeStretch ? (
                <StretchItem stretch={activeStretch} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default RoutineEditor;
