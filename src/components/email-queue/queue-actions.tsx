"use client";

import { Button } from "@/components/ui/button";
import { Send, Trash2, RefreshCw } from "lucide-react";

interface QueueActionsProps {
  selectedCount: number;
  onSendSelected: () => void;
  onDeleteSelected: () => void;
  onRefresh: () => void;
  isSending: boolean;
}

export default function QueueActions({
  selectedCount,
  onSendSelected,
  onDeleteSelected,
  onRefresh,
  isSending,
}: QueueActionsProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Button
        onClick={onSendSelected}
        disabled={selectedCount === 0 || isSending}
        className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4 mr-2" />
        {isSending
          ? "Sending..."
          : `Send ${selectedCount > 0 ? `(${selectedCount})` : "Selected"}`}
      </Button>

      <Button
        onClick={onDeleteSelected}
        disabled={selectedCount === 0 || isSending}
        variant="destructive"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete {selectedCount > 0 ? `(${selectedCount})` : "Selected"}
      </Button>

      <Button
        onClick={onRefresh}
        disabled={isSending}
        variant="outline"
        className="ml-auto"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
}