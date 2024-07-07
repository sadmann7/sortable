"use client"

import * as React from "react"

import { getItems } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"
import { Sortable, SortableItem } from "@/components/ui/sortable"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Items() {
  const items = getItems()
  const [allItems, setAllItems] = React.useState(items)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <Sortable
            orientation="horizontal"
            value={allItems}
            onValueChange={setAllItems}
            overlay={<Skeleton className="h-8 w-full" />}
          >
            {["Name", "Description", "Price", "Stock"].map((heading) => (
              <SortableItem key={heading} value={heading} asChild>
                <TableHead key={heading}>{heading}</TableHead>
              </SortableItem>
            ))}
          </Sortable>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
