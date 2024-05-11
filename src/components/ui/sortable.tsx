"use client"

import * as React from "react"
import type {
  DndContextProps,
  DraggableSyntheticListeners,
  DropAnimation,
  UniqueIdentifier,
} from "@dnd-kit/core"
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Slot, type SlotProps } from "@radix-ui/react-slot"

import { composeRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface WithId {
  id: UniqueIdentifier
}

interface SortableProps<TData extends WithId> extends DndContextProps {
  /**
   * An array of data items that the sortable component will render.
   * @example
   * value={[
   *   { id: 1, name: 'Item 1' },
   *   { id: 2, name: 'Item 2' },
   * ]}
   */
  value: TData[]

  /**
   * An optional callback function that is called when the order of the data items changes.
   * It receives the new array of items as its argument.
   * @example
   * onValueChange={(items) => console.log(items)}
   */
  onValueChange?: (items: TData[]) => void

  /**
   * An optional callback function that is called when an item is moved.
   * It receives an event object with `activeIndex` and `overIndex` properties, representing the original and new positions of the moved item.
   * This will override the default behavior of moving the item in the array.
   * @type (event: { activeIndex: number; overIndex: number }) => void
   * @example
   * onMove={(event) => console.log(`Item moved from index ${event.activeIndex} to index ${event.overIndex}`)}
   */
  onMove?: (event: { activeIndex: number; overIndex: number }) => void

  /**
   * An optional React node that is rendered on top of the sortable component.
   * It can be used to display additional information or controls.
   * @default null
   * @type React.ReactNode | null
   * @example
   * overlay={<Skeleton className="w-full h-8" />}
   */
  overlay?: React.ReactNode | null
}

function Sortable<TData extends WithId>({
  value,
  onValueChange,
  modifiers = [restrictToVerticalAxis, restrictToParentElement],
  onMove,
  children,
  overlay,
  ...props
}: SortableProps<TData>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <DndContext
      modifiers={modifiers}
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = value.findIndex(({ id }) => id === active.id)
          const overIndex = value.findIndex(({ id }) => id === over.id)

          if (onMove) {
            onMove({ activeIndex, overIndex })
          } else {
            onValueChange?.(arrayMove(value, activeIndex, overIndex))
          }
        }
        setActiveId(null)
      }}
      onDragCancel={() => setActiveId(null)}
      {...props}
    >
      <SortableContext items={value}>{children}</SortableContext>
      <SortableOverlay activeId={activeId}>{overlay}</SortableOverlay>
    </DndContext>
  )
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
}

interface SortableOverlayProps
  extends React.ComponentPropsWithRef<typeof DragOverlay> {
  activeId?: UniqueIdentifier | null
}

function SortableOverlay({
  activeId,
  dropAnimation = dropAnimationConfig,
  children,
  ...props
}: SortableOverlayProps) {
  return (
    <DragOverlay dropAnimation={dropAnimation} {...props}>
      {activeId ? (
        <SortableItem id={activeId} asChild>
          {children}
        </SortableItem>
      ) : null}
    </DragOverlay>
  )
}

interface SortableItemContextProps {
  attributes: React.HTMLAttributes<HTMLElement>
  listeners: DraggableSyntheticListeners | undefined
}

const SortableItemContext = React.createContext<SortableItemContextProps>({
  attributes: {},
  listeners: undefined,
})

function useSortableItem() {
  const context = React.useContext(SortableItemContext)

  if (!context) {
    throw new Error("useSortableItem must be used within a SortableItem")
  }

  return context
}

interface SortableItemProps extends Omit<SlotProps, "id">, WithId {
  asChild?: boolean
}

const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
  ({ asChild, className, id, ...props }, ref) => {
    const {
      attributes,
      isDragging,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id })

    const context = React.useMemo(
      () => ({
        attributes,
        listeners,
      }),
      [attributes, listeners]
    )
    const style: React.CSSProperties = {
      opacity: isDragging ? 0.4 : undefined,
      transform: CSS.Translate.toString(transform),
      transition,
    }

    const Comp = asChild ? Slot : "div"

    return (
      <SortableItemContext.Provider value={context}>
        <Comp
          className={cn(isDragging && "cursor-grabbing", className)}
          ref={composeRefs(ref, setNodeRef as React.Ref<HTMLDivElement>)}
          style={style}
          {...props}
        />
      </SortableItemContext.Provider>
    )
  }
)
SortableItem.displayName = "SortableItem"

interface SortableDragHandleProps extends ButtonProps {
  withHandle?: boolean
}

const SortableDragHandle = React.forwardRef<
  HTMLButtonElement,
  SortableDragHandleProps
>(({ className, ...props }, ref) => {
  const { attributes, listeners } = useSortableItem()

  return (
    <Button
      ref={composeRefs(ref)}
      className={cn("cursor-grab", className)}
      {...attributes}
      {...listeners}
      {...props}
    />
  )
})
SortableDragHandle.displayName = "SortableDragHandle"

export { Sortable, SortableDragHandle, SortableItem }
