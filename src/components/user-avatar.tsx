"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

const sizeClasses = { sm: "w-6 h-6 text-xs", md: "w-8 h-8 text-sm", lg: "w-10 h-10 text-base" };

export function UserAvatar({
  src, name = "User", color = "#4f46e5", size = "md", showTooltip = true,
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatar = (
    <Avatar className={cn(sizeClasses[size], "ring-2 ring-white")} style={{ borderColor: color }}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback style={{ backgroundColor: color }} className="text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!showTooltip) return avatar;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{avatar}</TooltipTrigger>
      <TooltipContent side="bottom"><p className="text-xs">{name}</p></TooltipContent>
    </Tooltip>
  );
}
