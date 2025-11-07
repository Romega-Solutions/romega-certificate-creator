"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X, Plus } from "lucide-react";

interface AddToQueueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  certificateImageUrl: string;
  recipientName: string;
  onSuccess?: () => void;
}

export default function AddToQueueDialog({
  isOpen,
  onClose,
  certificateImageUrl,
  recipientName,
  onSuccess,
}: AddToQueueDialogProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(
    `Your Certificate of Completion - ${recipientName}`
  );
  const [message, setMessage] = useState(
    `Dear ${recipientName},\n\nCongratulations! Please find your Certificate of Completion attached.\n\nBest regards,\nRomega Solutions`
  );
  const [isAdding, setIsAdding] = useState(false);
  const [addStatus, setAddStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAdd = async () => {
    if (!email.trim() || !validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    if (!subject.trim()) {
      setErrorMessage("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Please enter a message");
      return;
    }

    setIsAdding(true);
    setAddStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/email-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: email.trim(),
          recipientName: recipientName,
          subject: subject.trim(),
          message: message.trim(),
          certificateImage: certificateImageUrl,
        }),
      });

      if (response.ok) {
        setAddStatus("success");
        onSuccess?.();
        setTimeout(() => {
          onClose();
          setEmail("");
          setSubject(`Your Certificate of Completion - ${recipientName}`);
          setMessage(
            `Dear ${recipientName},\n\nCongratulations! Please find your Certificate of Completion attached.\n\nBest regards,\nRomega Solutions`
          );
          setAddStatus("idle");
        }, 1500);
      } else {
        const data = await response.json();
        setAddStatus("error");
        setErrorMessage(data.error || "Failed to add to queue");
      }
    } catch (error) {
      setAddStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Network error");
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Add to Email Queue
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Save this certificate to send later (works offline!)
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isAdding}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Recipient Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              disabled={isAdding}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSubject(e.target.value)
              }
              disabled={isAdding}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.target.value)
              }
              disabled={isAdding}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Certificate will be attached automatically when sent
            </p>
          </div>

          {addStatus === "success" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">
                Added to queue! ✨ Go to Email Queue to send it.
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <X className="w-5 h-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-zinc-700 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isAdding}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={isAdding || addStatus === "success"}
            className="bg-green-600 hover:bg-green-700"
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : addStatus === "success" ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add to Queue
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
