"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Check, X } from "lucide-react";

interface EmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  certificateImageUrl: string;
  recipientName: string;
}

export default function EmailDialog({
  isOpen,
  onClose,
  certificateImageUrl,
  recipientName,
}: EmailDialogProps) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(
    `Your Certificate of Completion - ${recipientName}`
  );
  const [message, setMessage] = useState(
    `Dear ${recipientName},\n\nCongratulations! Please find your Certificate of Completion attached.\n\nBest regards,\nRomega Solutions`
  );
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter an email address");
      return;
    }

    if (!validateEmail(email)) {
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

    setIsSending(true);
    setSendStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          certificateImage: certificateImageUrl,
          recipientName: recipientName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendStatus("success");
        setTimeout(() => {
          onClose();
          setEmail("");
          setSubject(`Your Certificate of Completion - ${recipientName}`);
          setMessage(
            `Dear ${recipientName},\n\nCongratulations! Please find your Certificate of Completion attached.\n\nBest regards,\nRomega Solutions`
          );
          setSendStatus("idle");
        }, 2000);
      } else {
        setSendStatus("error");
        setErrorMessage(data.error || "Failed to send certificate");
      }
    } catch (error) {
      console.error("Send error:", error);
      setSendStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Network error occurred"
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Send Certificate via Email
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enter the recipient's email address and customize your message
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSending}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Recipient Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              disabled={isSending}
              className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600"
            />
          </div>

          {/* Subject Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Your Certificate of Completion"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrorMessage("");
              }}
              disabled={isSending}
              className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600"
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Message <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrorMessage("");
              }}
              disabled={isSending}
              rows={6}
              className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 The certificate will be attached automatically
            </p>
          </div>

          {/* Status Messages */}
          {sendStatus === "success" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">
                Certificate sent successfully! ✨
              </span>
            </div>
          )}

          {sendStatus === "error" && errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Failed to send certificate</p>
                <p className="text-xs mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && sendStatus === "idle" && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <X className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-zinc-700 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || sendStatus === "success"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : sendStatus === "success" ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Sent!
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Certificate
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}