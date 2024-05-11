"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable"

const schema = z.object({
  flipTricks: z.array(
    z.object({
      name: z.string(),
      spin: z.string(),
    })
  ),
})

type Schema = z.infer<typeof schema>

export function HookFormDemo() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      flipTricks: [
        {
          name: "Kickflip",
          spin: "360",
        },
        {
          name: "Heelflip",
          spin: "180",
        },
      ],
    },
  })

  function onSubmit(input: Schema) {
    console.log({ input })
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flipTricks",
  })

  return (
    <div className="rounded-lg border p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-4xl flex-col gap-4"
        >
          <div className="space-y-1">
            <h4>Flip tricks</h4>
            <p className="text-[0.8rem] text-muted-foreground">
              Add your favorite flip tricks
            </p>
          </div>
          <div className="space-y-2">
            <Sortable
              value={fields}
              onValueChange={(value) => form.setValue("flipTricks", value)}
              overlay={
                <div className="grid grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
                  <Skeleton className="h-8 w-full rounded-sm" />
                  <Skeleton className="h-8 w-full rounded-sm" />
                  <Skeleton className="size-8 shrink-0 rounded-sm" />
                  <Skeleton className="size-8 shrink-0 rounded-sm" />
                </div>
              }
            >
              <div className="w-full space-y-2">
                {fields.map((field, index) => (
                  <SortableItem key={field.id} value={field.id} asChild>
                    <div className="grid grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`flipTricks.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input className="h-8" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`flipTricks.${index}.spin`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input className="h-8" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <SortableDragHandle
                        variant="outline"
                        size="icon"
                        className="size-8 shrink-0"
                      >
                        <DragHandleDots2Icon
                          className="size-4"
                          aria-hidden="true"
                        />
                      </SortableDragHandle>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon
                          className="size-4 text-destructive"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </Sortable>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() =>
                append({
                  name: "",
                  spin: "",
                })
              }
            >
              Add trick
            </Button>
          </div>
          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
