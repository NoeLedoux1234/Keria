"use client";

import { useState, useEffect } from "react";
import { Button } from "@meetpoint/ui";
import { QRCodeSVG } from "qrcode.react";

interface EventShareCardProps {
  eventName: string;
  shareCode: string;
}

export function EventShareCard({ eventName, shareCode }: EventShareCardProps) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/join-event?code=${shareCode}` : "";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      setCodeCopied(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setLinkCopied(false);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    if (canShare) {
      try {
        await navigator.share({
          title: eventName,
          text: `Rejoignez « ${eventName} » sur Keria`,
          url: shareUrl,
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        await handleCopyLink();
      }
      return;
    }
    await handleCopyLink();
  };

  return (
    <div className="border-keria-gold/30 bg-keria-gold/5 rounded border p-4">
      <div className="flex items-center justify-between">
        <p className="text-keria-gold text-[10px] uppercase tracking-wider">Code de partage</p>
        <button
          onClick={handleCopyCode}
          className="text-keria-gold hover:bg-keria-gold/10 hover:text-keria-gold flex items-center gap-1 rounded px-2 py-1 text-[10px] uppercase tracking-wider transition-colors"
        >
          {codeCopied ? (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copié
            </>
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copier
            </>
          )}
        </button>
      </div>
      <p className="text-keria-gold mt-1 font-mono text-3xl font-bold tracking-[0.2em]">
        {shareCode}
      </p>
      {shareUrl && <p className="text-keria-muted mt-2 break-all text-[10px]">{shareUrl}</p>}

      {shareUrl && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="bg-keria-cream rounded p-3">
            <QRCodeSVG value={shareUrl} size={148} level="M" />
          </div>
          <Button
            variant="primary"
            size="sm"
            className="w-full text-[10px] uppercase tracking-wider"
            onClick={handleShare}
          >
            {linkCopied ? "Lien copié" : "Partager"}
          </Button>
        </div>
      )}
    </div>
  );
}
