import { Shell } from "@/components/shell"

import { HookFormDemo } from "./_components/hook-form-demo"
import { Items } from "./_components/items"

export default function IndexPage() {
  return (
    <Shell>
      <HookFormDemo />
      <Items />
    </Shell>
  )
}
