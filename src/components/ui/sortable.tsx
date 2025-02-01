"use client"

import * as React from "react"
import type {
  DndContextProps,
  DraggableSyntheticListeners,
  DropAnimation,
  UniqueIdentifier,
} from "@dnd-kit/core"
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers"
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  type SortableContextProps,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Slot, type SlotProps } from "@radix-ui/react-slot"

import { composeRefs } from "@/lib/compose-refs"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
  },
}

interface SortableProps<
  TData extends Record<TKeyName, UniqueIdentifier>,
  TKeyName extends string = "id",
> extends DndContextProps {
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
   * This will override the default behavior of updating the order of the data items.
   * @type (event: { activeIndex: number; overIndex: number }) => void
   * @example
   * onMove={(event) => console.log(`Item moved from index ${event.activeIndex} to index ${event.overIndex}`)}
   */
  onMove?: (event: { activeIndex: number; overIndex: number }) => void

  /**
   * A collision detection strategy that will be used to determine the closest sortable item.
   * @default closestCenter
   * @type DndContextProps["collisionDetection"]
   */
  collisionDetection?: DndContextProps["collisionDetection"]

  /**
   * An array of modifiers that will be used to modify the behavior of the sortable component.
   * @default
   * [restrictToVerticalAxis, restrictToParentElement]
   * @type Modifier[]
   */
  modifiers?: DndContextProps["modifiers"]

  /**
   * A sorting strategy that will be used to determine the new order of the data items.
   * @default verticalListSortingStrategy
   * @type SortableContextProps["strategy"]
   */
  strategy?: SortableContextProps["strategy"]

  /**
   * Specifies the axis for the drag-and-drop operation. It can be "vertical", "horizontal", or "mixed".
   * @default "vertical"
   * @type "vertical" | "horizontal" | "mixed"
   */
  orientation?: "vertical" | "horizontal" | "mixed"

  /**
   * An optional React node that is rendered on top of the sortable component.
   * It can be used to display additional information or controls.
   * @default null
   * @type React.ReactNode | null
   * @example
   * overlay={<Skeleton className="w-full h-8" />}
   */
  overlay?: React.ReactNode | null

  /**
   * The key to use as the unique identifier in the data items.
   * @default "id"
   * @type keyof TKeyName
   */
  keyName?: TKeyName
}

function Sortable<
  TData extends Record<TKeyName, UniqueIdentifier>,
  TKeyName extends string = "id",
>({
  value,
  onValueChange,
  collisionDetection = closestCenter,
  modifiers,
  strategy,
  onMove,
  orientation = "vertical",
  keyName = "id" as TKeyName,
  overlay,
  children,
  ...props
}: SortableProps<TData, TKeyName>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const config = orientationConfig[orientation] ?? orientationConfig.vertical

  return (
    <DndContext
      modifiers={modifiers ?? config.modifiers}
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={({ active, over }) => {
        if (over) {
          const activeIndex = value.findIndex(
            (item) => item[keyName] === active.id
          )
          const overIndex = value.findIndex((item) => item[keyName] === over.id)

          if (activeIndex !== -1 && overIndex !== -1) {
            if (onMove) {
              onMove({ activeIndex, overIndex })
            } else {
              onValueChange?.(arrayMove(value, activeIndex, overIndex))
            }
          }
        }
        setActiveId(null)
      }}
      onDragCancel={() => setActiveId(null)}
      collisionDetection={collisionDetection}
      {...props}
    >
      <SortableContext
        items={value.map((item) => item[keyName])}
        strategy={strategy ?? config.strategy}
      >
        {children}
      </SortableContext>
      {overlay ? (
        <SortableOverlay activeId={activeId}>{overlay}</SortableOverlay>
      ) : null}
    </DndContext>
  )
}

const dropAnimationOpts: DropAnimation = {
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

const SortableOverlay = React.forwardRef<HTMLDivElement, SortableOverlayProps>(
  (
    { activeId, dropAnimation = dropAnimationOpts, children, ...props },
    ref
  ) => (
    <DragOverlay dropAnimation={dropAnimation} {...props}>
      {activeId ? (
        <SortableItem
          ref={ref}
          value={activeId}
          className="cursor-grabbing"
          asChild
        >
          {children}
        </SortableItem>
      ) : null}
    </DragOverlay>
  )
)
SortableOverlay.displayName = "SortableOverlay"

interface SortableItemContextProps {
  attributes: React.HTMLAttributes<HTMLElement>
  listeners: DraggableSyntheticListeners | undefined
  isDragging?: boolean
}

const SortableItemContext = React.createContext<SortableItemContextProps>({
  attributes: {},
  listeners: undefined,
  isDragging: false,
})

function useSortableItem() {
  const context = React.useContext(SortableItemContext)

  if (!context) {
    throw new Error(
      "useSortableItem must be used within a SortableItemContext.Provider"
    )
  }

  return context
}

interface SortableItemProps extends SlotProps {
  /**
   * The unique identifier of the item.
   * @example "item-1"
   * @type UniqueIdentifier
   */
  value: UniqueIdentifier

  /**
   * Specifies whether the item should act as a trigger for the drag-and-drop action.
   * @default false
   * @type boolean | undefined
   */
  asTrigger?: boolean

  /**
   * Merges the item's props into its immediate child.
   * @default false
   * @type boolean | undefined
   */
  asChild?: boolean
}

const SortableItem = React.forwardRef<HTMLElement, SortableItemProps>(
  ({ value, asTrigger, asChild, className, ...props }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: value })

    const context = React.useMemo<SortableItemContextProps>(
      () => ({
        attributes,
        listeners,
        isDragging,
      }),
      [attributes, listeners, isDragging]
    )
    const style: React.CSSProperties = {
      opacity: isDragging ? 0.5 : 1,
      transform: CSS.Translate.toString(transform),
      transition,
    }

    const Comp = asChild ? Slot : "div"

    return (
      <SortableItemContext.Provider value={context}>
        <Comp
          data-state={isDragging ? "dragging" : undefined}
          className={cn(
            "data-[state=dragging]:cursor-grabbing",
            { "cursor-grab": !isDragging && asTrigger },
            className
          )}
          ref={(node) => {
            if (node) composeRefs(ref, setNodeRef)
            setNodeRef(node)
          }}
          style={style}
          {...(asTrigger ? attributes : {})}
          {...(asTrigger ? listeners : {})}
          {...props}
        />
      </SortableItemContext.Provider>
    )
  }
)
SortableItem.displayName = "SortableItem"

type SortableDragHandleProps =
  | ({
      asChild?: false
    } & ButtonProps)
  | ({
      asChild: true
    } & SlotProps)

const SortableDragHandle = React.forwardRef<
  HTMLButtonElement,
  SortableDragHandleProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const { attributes, listeners, isDragging } = useSortableItem()

  const Comp = asChild ? Slot : Button

  return (
    <Comp
      ref={ref}
      data-state={isDragging ? "dragging" : undefined}
      className={cn(
        "cursor-grab data-[state=dragging]:cursor-grabbing",
        className
      )}
      {...attributes}
      {...listeners}
      {...props}
    >
      {children}
    </Comp>
  )
})
SortableDragHandle.displayName = "SortableDragHandle"

export { Sortable, SortableDragHandle, SortableItem, SortableOverlay }
