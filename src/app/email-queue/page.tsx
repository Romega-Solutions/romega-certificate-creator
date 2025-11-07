"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QueueStats from "@/components/email-queue/queue-stats";
import QueueFilters from "@/components/email-queue/queue-filters";
import QueueActions from "@/components/email-queue/queue-actions";
import QueueTable from "@/components/email-queue/queue-table";
import { Button } from "@/components/ui/button";
import {
  EmailQueueItem,
  EmailQueueFilters,
  EmailQueueStats,
} from "@/types/email-queue";
import { ArrowLeft, Mail } from "lucide-react";

export default function EmailQueuePage() {
  const router = useRouter();
  const [items, setItems] = useState<EmailQueueItem[]>([]);
  const [stats, setStats] = useState<EmailQueueStats>({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
  });
  const [filters, setFilters] = useState<EmailQueueFilters>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [viewItem, setViewItem] = useState<EmailQueueItem | null>(null);

  // Fetch queue items
  const fetchQueue = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const response = await fetch(`/api/email-queue?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch queue:", error);
      alert("Failed to load email queue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [filters]);

  // Send selected emails
  const handleSendSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = confirm(
      `Send ${selectedIds.length} email(s)? This requires internet connection.`
    );
    if (!confirmed) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/batch-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setSelectedIds([]);
        fetchQueue();
      } else {
        alert("Failed to send emails: " + data.error);
      }
    } catch (error) {
      console.error("Send error:", error);
      alert("Network error. Please check your internet connection.");
    } finally {
      setIsSending(false);
    }
  };

  // Send single email
  const handleSendOne = async (id: number) => {
    const confirmed = confirm("Send this email now?");
    if (!confirmed) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/batch-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Email sent successfully!");
        fetchQueue();
      } else {
        alert("Failed to send email: " + data.error);
      }
    } catch (error) {
      console.error("Send error:", error);
      alert("Network error. Please check your internet connection.");
    } finally {
      setIsSending(false);
    }
  };

  // Delete selected emails
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = confirm(
      `Delete ${selectedIds.length} email(s)? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/email-queue?id=${id}`, { method: "DELETE" })
        )
      );

      setSelectedIds([]);
      fetchQueue();
      alert("Deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete emails");
    }
  };

  // Delete single email
  const handleDeleteOne = async (id: number) => {
    const confirmed = confirm("Delete this email? This cannot be undone.");
    if (!confirmed) return;

    try {
      await fetch(`/api/email-queue?id=${id}`, { method: "DELETE" });
      fetchQueue();
      alert("Deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete email");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/generator")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Generator
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue-600" />
                Email Queue
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and send certificate emails
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <QueueStats stats={stats} />

        {/* Filters */}
        <QueueFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={() => setFilters({})}
        />

        {/* Actions */}
        <QueueActions
          selectedCount={selectedIds.length}
          onSendSelected={handleSendSelected}
          onDeleteSelected={handleDeleteSelected}
          onRefresh={fetchQueue}
          isSending={isSending}
        />

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <QueueTable
            items={items}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onDelete={handleDeleteOne}
            onSend={handleSendOne}
            onView={setViewItem}
          />
        )}

        {/* View Item Dialog */}
        {viewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-xl font-semibold">Email Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Recipient
                  </label>
                  <p className="text-lg">{viewItem.recipientName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-lg">{viewItem.recipientEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Subject
                  </label>
                  <p className="text-lg">{viewItem.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Message
                  </label>
                  <p className="text-sm whitespace-pre-wrap bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                    {viewItem.message}
                  </p>
                </div>
                {viewItem.errorMessage && (
                  <div>
                    <label className="text-sm font-semibold text-red-600">
                      Error
                    </label>
                    <p className="text-sm text-red-600">
                      {viewItem.errorMessage}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Certificate Preview
                  </label>
                  <img
                    src={viewItem.certificateImage}
                    alt="Certificate"
                    className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 mt-2"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-zinc-700 flex justify-end">
                <Button onClick={() => setViewItem(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}