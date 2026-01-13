import React, { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useRoutine } from "../../hooks/useRoutine";
import { useRoutines } from "../../hooks/useRoutines";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
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

const RoutineEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deleteRoutine } = useRoutines();
  const routine = useRoutine(id!);

  const {
    name,
    updateName,
    stretches,
    updateStretches,
    duration,
    updateDuration,
    restDuration,
    updateRestDuration,
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

  // If routine doesn't exist, redirect to home
  if (!id || !name) {
    return <Navigate to="/" replace />;
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteRoutine(id);
      navigate("/");
    }
  };

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
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)] font-sans p-4 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-8 pt-2">
        <Button
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
          size="sm"
          aria-label="Back"
        />
        <h1 className="text-xl font-bold tracking-tight">Edit Routine</h1>
        <span className="w-8"></span>
      </header>

      <div className="w-full max-w-md flex flex-col gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Routine Info</h2>
          <div className="bg-[var(--color-bg-layer)] border border-[var(--color-border-default)] rounded-2xl p-6 space-y-6">
            <TextInput
              label="Routine Name"
              value={name}
              onChange={(e) => updateName(e.target.value)}
            />

            <SliderInput
              label="Active Duration"
              min={1}
              max={90}
              value={duration}
              onChange={updateDuration}
            />

            <SliderInput
              label="Rest Duration"
              min={0}
              max={30}
              value={restDuration}
              onChange={updateRestDuration}
              formatValue={(v) => (v === 0 ? "No rest" : `${v}s`)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Routine</h2>
            <Button
              onClick={addStretch}
              icon={Plus}
              size="sm"
              aria-label="Add Stretch"
            />
          </div>
          {stretches.length === 0 ? (
            <div className="text-center py-12 bg-[var(--color-bg-layer)] border border-dashed rounded-3xl border-[var(--color-border-default)]">
              <p className="text-[var(--color-fg-muted)] mb-4">
                Your routine is empty.
              </p>
              <Button onClick={addStretch} kind="primary">
                Add your first stretch
              </Button>
            </div>
          ) : (
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
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Feeling unmotivated?</h2>
          <Button
            className="w-full border-1 border-[var(--color-border-default)]"
            onClick={handleDelete}
            icon={Trash2}
            size="md"
            destructive
          >
            Delete Routine
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoutineEditor;
