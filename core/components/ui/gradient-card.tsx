import type React from "react"
import { Card } from "@/core/components/ui/card"
import { cn } from "@/core/lib/utils"

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GradientCard({ children, className, ...props }: GradientCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-purple-200/50 bg-gradient-to-br from-white to-purple-50/30 shadow-lg shadow-purple-100/20",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
      <div className="relative">{children}</div>
    </Card>
  )
}
