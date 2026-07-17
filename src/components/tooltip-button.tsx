"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TooltipButton({
  icon: Icon,
  label,
  onClick,
  isActive,
  disabled,
  className,
}: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "h-7 w-7 p-0",
            isActive && "bg-accent text-accent-foreground",
            className
          )}
          aria-label={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
