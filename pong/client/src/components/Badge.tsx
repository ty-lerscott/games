import { CircleCheck, CircleMinus } from 'lucide-react'
import { cn } from '../lib/utils.ts'

const Badge = ({status}: {status: 'offline' | 'ok'}) => {
  return (
    <p className={cn("rounded-[0.5rem] p-2 inline-flex gap-2 w-min font-semibold border my-4",
      status === 'ok' ?
        "bg-badge-success-background text-badge-success-foreground border-badge-success-border"
        : "bg-badge-error-background text-badge-error-foreground border-badge-error-border")}>
      {status === 'ok' ? (
        <CircleCheck />
      ): (
        <CircleMinus />
      )}
      {status.toUpperCase()}
    </p>
  )
}

export default Badge;
