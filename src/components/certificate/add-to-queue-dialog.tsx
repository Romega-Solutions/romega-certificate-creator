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

  const templates: Record<
    "event" | "kpi" | "internship" | "umak",
    { label: string; subject: string; message: string }
  > = {
    event: {
      label: "Event Certification",
      subject: `Certificate of Attendance - ${recipientName}`,
      message: `Dear ${recipientName},\n\nThank you for attending our event. Please find your Certificate of Attendance attached. We appreciate your participation!\n\nBest regards,\nRomega Solutions`,
    },
    kpi: {
      label: "KPI Certification",
      subject: `KPI Achievement Certificate - ${recipientName}`,
      message: `Dear ${recipientName},\n\nCongratulations on achieving your KPI milestones. Please find your KPI Achievement Certificate attached as recognition of your performance.\n\nBest regards,\nRomega Solutions`,
    },
    internship: {
      label: "Internship Completion",
      subject: `Certificate of Completion - Internship - ${recipientName}`,
      message: `Dear ${recipientName},\n\nCongratulations on completing your internship. Please find your Certificate of Completion attached. Wishing you continued success in your career.\n\nBest regards,\nRomega Solutions`,
    },
    umak: {
      label: "UMak Event (InfotechnOlympics Style)",
      subject: "Your e-certificate is now ready",
      message: `Dear ${recipientName},\n\nI hope this email finds you well. On behalf of the CCIS Student Council, we are pleased to inform you that your e-certificate is now ready. We sincerely appreciate your enthusiasm, time, and effort in the previously conducted event.\n\nThank you once again for your active participation. As a token of appreciation, attached here is your e-certificate.\n\nIf you have any questions or concerns, please feel free to reply in this email thread.\n\nWarm regards,\nCCIS Student Council\n\nThis message contains confidential information and is intended only for the individual named. If you are not the named addressee you should not disseminate, distribute or copy this e-mail. Please notify the sender immediately by e-mail if you have received this e-mail by mistake and delete this e-mail from your system. E-mail transmission cannot be guaranteed to be secure or error-free as information could be intercepted, corrupted, lost, destroyed, arrive late or incomplete, or contain viruses. The sender therefore does not accept liability for any errors or omissions in the contents of this message, which arise as a result of e-mail transmission.`,
    },
  };

  const applyTemplate = (key: "event" | "kpi" | "internship" | "umak") => {
    const t = templates[key];
    setSubject(t.subject);
    setMessage(t.message);
    setErrorMessage("");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-700 shrink-0">
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
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
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
            <label className="block text-sm font-semibold mb-2">Presets</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => applyTemplate("event")}
                disabled={isAdding}
                className="px-3 py-1 text-sm"
              >
                Event
              </Button>
              <Button
                variant="outline"
                onClick={() => applyTemplate("kpi")}
                disabled={isAdding}
                className="px-3 py-1 text-sm"
              >
                KPI
              </Button>
              <Button
                variant="outline"
                onClick={() => applyTemplate("internship")}
                disabled={isAdding}
                className="px-3 py-1 text-sm"
              >
                Internship
              </Button>
              <Button
                variant="outline"
                onClick={() => applyTemplate("umak")}
                disabled={isAdding}
                className="px-3 py-1 text-sm"
              >
                UMak
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Choose a preset to auto-fill subject and message
            </p>
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

        <div className="p-6 border-t border-gray-200 dark:border-zinc-700 flex justify-end gap-2 shrink-0 bg-white dark:bg-zinc-900">
          <Button variant="outline" onClick={onClose} disabled={isAdding}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={isAdding || addStatus === "success"}
            className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
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
