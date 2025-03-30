"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableOverlay,
} from "@/components/ui/sortable";
import type { UniqueIdentifier } from "@dnd-kit/core";
import * as React from "react";

interface Trick {
  id: string;
  title: string;
  description: string;
}

const data: Trick[] = [
  {
    id: "1",
    title: "The 900",
    description: "The 900 is a trick where you spin 900 degrees in the air.",
  },
  {
    id: "2",
    title: "Indy Backflip",
    description: "The Indy Backflip is a trick where you backflip in the air.",
  },
  {
    id: "3",
    title: "Pizza Guy",
    description: "The Pizza Guy is a trick where you flip the pizza guy.",
  },
  {
    id: "4",
    title: "Rocket Air",
    description: "The Rocket Air is a trick where you rocket air.",
  },
  {
    id: "5",
    title: "Kickflip Backflip",
    description:
      "The Kickflip Backflip is a trick where you kickflip backflip.",
  },
  {
    id: "6",
    title: "FS 540",
    description: "The FS 540 is a trick where you fs 540.",
  },
  {
    id: "7",
    title: "Double Cork 1080",
    description:
      "A complex aerial maneuver combining three rotations with two off-axis flips.",
  },
  {
    id: "8",
    title: "Triple Cork 1440",
    description:
      "An advanced aerial trick with four full rotations and three off-axis flips.",
  },
  {
    id: "9",
    title: "Rodeo 540",
    description:
      "A backflip combined with a 540-degree rotation, creating a stylish off-axis spin.",
  },
  {
    id: "10",
    title: "Switch Double Backflip",
    description:
      "Two backflips performed while riding in the opposite stance from normal.",
  },
  {
    id: "11",
    title: "Misty 720",
    description:
      "An off-axis rotation combining a front flip with two full spins.",
  },
  {
    id: "12",
    title: "Cork 720 Japan",
    description:
      "A cork rotation with two spins while grabbing the board in japan position.",
  },
  {
    id: "13",
    title: "Cab 1080 Double Cork",
    description:
      "A switch frontside 1080 with two cork rotations, performed with exceptional style.",
  },
  {
    id: "14",
    title: "Frontside Triple Underflip",
    description:
      "Three underflipped rotations performed while spinning frontside.",
  },
  {
    id: "15",
    title: "Double Wildcat",
    description:
      "Two consecutive backflips performed without vertical rotation, staying flat.",
  },
  {
    id: "16",
    title: "Quad Cork 1800",
    description:
      "A groundbreaking trick combining five rotations with four off-axis flips.",
  },
];

export function MixedSortingDemo() {
  const [tricks, setTricks] = React.useState<Trick[]>(data);

  const onValueChange = React.useCallback((newTricks: Trick[]) => {
    setTricks(newTricks);
  }, []);

  const getItemValue = React.useCallback((item: Trick) => item.id, []);

  const renderOverlay = React.useCallback(
    ({ value }: { value: UniqueIdentifier }) => {
      const trick = tricks.find((trick) => trick.id === value);
      if (!trick) return null;

      return <TrickCard trick={trick} />;
    },
    [tricks],
  );

  return (
    <Sortable
      value={tricks}
      onValueChange={onValueChange}
      getItemValue={getItemValue}
      orientation="mixed"
    >
      <SortableContent className="grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-4">
        {tricks.map((trick) => (
          <TrickCard key={trick.id} trick={trick} asHandle />
        ))}
      </SortableContent>
      <SortableOverlay>{renderOverlay}</SortableOverlay>
    </Sortable>
  );
}

interface TrickCardProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SortableItem>, "value"> {
  trick: Trick;
}

function TrickCard({ trick, ...props }: TrickCardProps) {
  return (
    <SortableItem value={trick.id} asChild {...props}>
      <Card className="h-full rounded-md bg-zinc-100 dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="sm:text-lg">{trick.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {trick.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </SortableItem>
  );
}
