import { Shell } from "@/components/shell"

import { MixedSortingDemo } from "./_components/mixed-sorting-demo"
import { VerticalSortingDemo } from "./_components/vertical-sorting-demo"

export default function IndexPage() {
  return (
    <Shell>
      <VerticalSortingDemo />
      <MixedSortingDemo />
    </Shell>
  )
}
