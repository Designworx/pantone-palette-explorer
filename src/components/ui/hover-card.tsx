
import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "relative",
      "before:absolute before:z-10 before:h-2 before:w-2 before:rotate-45 before:bg-popover before:border-l before:border-t before:border-border",
      "data-[side=top]:before:bottom-[-5px] data-[side=top]:before:left-1/2 data-[side=top]:before:-translate-x-1/2 data-[side=top]:before:border-b data-[side=top]:before:border-r data-[side=top]:before:border-l-transparent data-[side=top]:before:border-t-transparent",
      "data-[side=bottom]:before:top-[-5px] data-[side=bottom]:before:left-1/2 data-[side=bottom]:before:-translate-x-1/2 data-[side=bottom]:before:border-t data-[side=bottom]:before:border-l data-[side=bottom]:before:border-b-transparent data-[side=bottom]:before:border-r-transparent",
      "data-[side=left]:before:right-[-5px] data-[side=left]:before:top-1/2 data-[side=left]:before:-translate-y-1/2 data-[side=left]:before:border-t data-[side=left]:before:border-l data-[side=left]:before:border-b-transparent data-[side=left]:before:border-r-transparent",
      "data-[side=right]:before:left-[-5px] data-[side=right]:before:top-1/2 data-[side=right]:before:-translate-y-1/2 data-[side=right]:before:border-b data-[side=right]:before:border-r data-[side=right]:before:border-l-transparent data-[side=right]:before:border-t-transparent",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
