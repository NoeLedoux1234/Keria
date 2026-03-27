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
    color: "bg-keria-success text-keria-cream",
    hoverColor: "hover:bg-keria-success-dark",
    selectedColor: "bg-keria-success text-keria-cream ring-2 ring-keria-success-light",
    inactiveColor: "bg-keria-forest/30 text-keria-cream hover:bg-keria-success/20 hover:text-keria-success-light",
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
    color: "bg-keria-error text-keria-cream",
    hoverColor: "hover:bg-keria-error-dark",
    selectedColor: "bg-keria-error text-keria-cream ring-2 ring-keria-error-light",
    inactiveColor: "bg-keria-forest/30 text-keria-cream hover:bg-keria-error/20 hover:text-keria-error-light",
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

export function RSVPBadge({ status }: { status: RSVPStatus }) {
  const config: Record<RSVPStatus, { label: string; className: string }> = {
    yes: { label: "Participe", className: "bg-keria-success/20 text-keria-success-light" },
    maybe: { label: "Peut-être", className: "bg-keria-gold/20 text-keria-gold" },
    no: { label: "Ne participe pas", className: "bg-keria-error/20 text-keria-error-light" },
    pending: { label: "En attente", className: "bg-keria-forest/50 text-keria-muted" },
  };

  const { label, className } = config[status];

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
