"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmailQueueItem } from "@/types/email-queue";
import { MoreVertical, Eye, Trash2, Send } from "lucide-react";
import { format } from "date-fns";

interface QueueTableProps {
  items: EmailQueueItem[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onDelete: (id: number) => void;
  onSend: (id: number) => void;
  onView: (item: EmailQueueItem) => void;
}

export default function QueueTable({
  items,
  selectedIds,
  onSelectionChange,
  onDelete,
  onSend,
  onView,
}: QueueTableProps) {
  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map((item) => item.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; className: string }> = {
      pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      sending: { variant: "default", className: "bg-blue-100 text-blue-800" },
      sent: { variant: "default", className: "bg-green-100 text-green-800" },
      failed: { variant: "destructive", className: "bg-red-100 text-red-800" },
    };

    const config = variants[status] || variants.pending;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700">
        <p className="text-gray-500 dark:text-gray-400">
          No emails in queue. Add certificates from the generator!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-gray-200 dark:border-zinc-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => handleSelectOne(item.id)}
                  aria-label={`Select ${item.recipientEmail}`}
                />
              </TableCell>
              <TableCell className="font-medium">
                {item.recipientName}
              </TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                {item.recipientEmail}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {item.subject}
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(item.createdAt), "MMM dd, yyyy HH:mm")}
              </TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                {item.sentAt
                  ? format(new Date(item.sentAt), "MMM dd, yyyy HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(item)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {item.status === "pending" && (
                      <DropdownMenuItem onClick={() => onSend(item.id)}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Now
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}