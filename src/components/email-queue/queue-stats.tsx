"use client";

import { EmailQueueStats } from "@/types/email-queue";
import { Mail, Clock, CheckCircle, XCircle } from "lucide-react";

interface QueueStatsProps {
  stats: EmailQueueStats;
}

export default function QueueStats({ stats }: QueueStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-gray-200 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-gray-200 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pending
            </p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Sent */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-gray-200 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Sent
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.sent}
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
        </div>
      </div>

      {/* Failed */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-gray-200 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Failed
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.failed}
            </p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-300" />
          </div>
        </div>
      </div>
    </div>
  );
}