import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,

} from "@dnd-kit/sortable";
import { FileCard } from "./FileCard";

interface FileItem {
    id: string;
    file: File;
    preview?: string;
}

interface FileListProps {
    files: FileItem[];
    onReorder: (files: FileItem[]) => void;
    onRemove: (id: string) => void;
}

export const FileList = ({ files, onReorder, onRemove }: FileListProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = files.findIndex((f) => f.id === active.id);
            const newIndex = files.findIndex((f) => f.id === over.id);
            onReorder(arrayMove(files, oldIndex, newIndex));
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={files.map((f) => f.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((fileItem) => (
                        <FileCard
                            key={fileItem.id}
                            id={fileItem.id}
                            file={fileItem.file}
                            preview={fileItem.preview}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
