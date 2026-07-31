"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOffIcon } from "lucide-react";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-sm font-medium px-4 py-2 flex items-center justify-center gap-2">
      <WifiOffIcon className="w-4 h-4" />
      <span>You are offline. Changes will sync when you reconnect.</span>
    </div>
  );
}
