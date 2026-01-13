import React from "react";
import { Trash2, GripVertical, Pencil } from "lucide-react";
import type { Stretch } from "../../types";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface StretchItemProps {
  stretch: Stretch;
  isDragging?: boolean;
  isOverlay?: boolean;
  editingId?: string | null;
  editName?: string;
  setEditName?: (name: string) => void;
  saveEdit?: () => void;
  cancelEdit?: () => void;
  removeStretch?: (id: string) => void;
  startEditing?: (stretch: Stretch) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export const StretchItem: React.FC<StretchItemProps> = ({
  stretch,
  isDragging,
  isOverlay,
  editingId,
  editName,
  setEditName,
  saveEdit,
  cancelEdit,
  removeStretch,
  startEditing,
  dragHandleProps,
}) => {
  return (
    <div
      className={`group bg-[var(--color-bg-layer)] border border-[var(--color-border-default)] rounded-2xl p-4 flex flex-col transition-all ${
        editingId === stretch.id ? "shadow-lg" : ""
      } ${isDragging ? "opacity-30 border-dashed" : ""} ${
        isOverlay ? "shadow-2xl scale-[1.02] cursor-grabbing" : ""
      }`}
    >
      {editingId === stretch.id ? (
        <div className="space-y-6">
          <TextInput
            label="Name"
            value={editName}
            onChange={(e) => setEditName?.(e.target.value)}
            className="bg-transparent"
            autoFocus
          />
          <div className="flex justify-between gap-2 items-center">
            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={saveEdit}
                size="sm"
                kind="primary"
                disabled={!editName?.trim()}
              >
                Save
              </Button>
              <Button onClick={cancelEdit} size="sm" kind="default">
                Cancel
              </Button>
            </div>
            <Button
              onClick={() => removeStretch?.(stretch.id)}
              icon={Trash2}
              size="sm"
              destructive
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            {...dragHandleProps}
            className="p-2 -ml-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)] cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <button
              className="font-bold text-lg truncate cursor-text"
              onClick={() => startEditing?.(stretch)}
            >
              {stretch.name}
            </button>
          </div>
          <div className="flex items-center gap-1">
            {!isOverlay && (
              <Button
                className="md:opacity-0 focus:opacity-100 group-hover:opacity-100 transition-opacity"
                onClick={() => startEditing?.(stretch)}
                icon={Pencil}
                size="sm"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export interface SortableStretchProps {
  stretch: Stretch;
  index: number;
  editingId: string | null;
  editName: string;
  setEditName: (name: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  removeStretch: (id: string) => void;
  startEditing: (stretch: Stretch) => void;
}

export const SortableStretch: React.FC<SortableStretchProps> = (props) => {
  const { stretch } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stretch.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <StretchItem
        {...props}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
