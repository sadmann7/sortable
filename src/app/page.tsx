import { Shell } from "@/components/shell"

import { MixedOrientaionDemo } from "./_components/mixed-orientation-demo"
import { VerticalSortingDemo } from "./_components/vertical-sorting-demo"

export default function IndexPage() {
  return (
    <Shell>
      <VerticalSortingDemo />
      <MixedOrientaionDemo />
    </Shell>
  )
}
