"use client";

type RSVPStatus = "yes" | "no" | "maybe" | "pending";

interface RSVPButtonsProps {
  currentStatus?: RSVPStatus;
  onRSVP: (status: "yes" | "no" | "maybe") => void;
  isLoading?: boolean;
  compact?: boolean;
}

const RSVP_CONFIG = {
  yes: {
    label: "Oui",
    color: "bg-green-500 text-white",
    hoverColor: "hover:bg-green-600",
    selectedColor: "bg-green-500 text-white ring-2 ring-green-400",
    inactiveColor: "bg-keria-forest/30 text-keria-cream hover:bg-green-900/30 hover:text-green-400",
  },
  maybe: {
    label: "Peut-être",
    color: "bg-keria-gold text-keria-darker",
    hoverColor: "hover:bg-keria-gold-dark",
    selectedColor: "bg-keria-gold text-keria-darker ring-2 ring-keria-gold/50",
    inactiveColor: "bg-keria-forest/30 text-keria-cream hover:bg-keria-gold/20 hover:text-keria-gold",
  },
  no: {
    label: "Non",
    color: "bg-red-500 text-white",
    hoverColor: "hover:bg-red-600",
    selectedColor: "bg-red-500 text-white ring-2 ring-red-400",
    inactiveColor: "bg-keria-forest/30 text-keria-cream hover:bg-red-900/30 hover:text-red-400",
  },
};

export function RSVPButtons({
  currentStatus,
  onRSVP,
  isLoading = false,
  compact = false,
}: RSVPButtonsProps) {
  const statuses: Array<"yes" | "maybe" | "no"> = ["yes", "maybe", "no"];

  return (
    <div className={`flex ${compact ? "gap-1" : "gap-2"}`}>
      {statuses.map((status) => {
        const config = RSVP_CONFIG[status];
        const isSelected = currentStatus === status;

        return (
          <button
            key={status}
            onClick={() => onRSVP(status)}
            disabled={isLoading}
            className={`
              flex items-center justify-center rounded-lg font-medium transition-all
              ${compact ? "px-3 py-1.5 text-sm" : "flex-1 px-4 py-2"}
              ${isSelected ? config.selectedColor : config.inactiveColor}
              disabled:cursor-not-allowed disabled:opacity-50
            `}
          >
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Affiche le statut RSVP sous forme de badge
 */
export function RSVPBadge({ status }: { status: RSVPStatus }) {
  const config: Record<RSVPStatus, { label: string; className: string }> = {
    yes: { label: "Participe", className: "bg-green-900/50 text-green-400" },
    maybe: { label: "Peut-être", className: "bg-keria-gold/20 text-keria-gold" },
    no: { label: "Ne participe pas", className: "bg-red-900/50 text-red-400" },
    pending: { label: "En attente", className: "bg-keria-forest/50 text-keria-muted" },
  };

  const { label, className } = config[status];

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
