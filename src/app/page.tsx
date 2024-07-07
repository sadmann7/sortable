import { Shell } from "@/components/shell"

import { HookFormDemo } from "./_components/hook-form-demo"
import { MixedAxisDemo } from "./_components/mixed-axis-demo"

export default function IndexPage() {
  return (
    <Shell>
      <HookFormDemo />
      <MixedAxisDemo />
    </Shell>
  )
}
