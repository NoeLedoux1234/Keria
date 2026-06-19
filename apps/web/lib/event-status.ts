export type EventStatus = "draft" | "published" | "ongoing" | "completed" | "cancelled";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

const STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Brouillon",
  published: "Publié",
  ongoing: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

const STATUS_BADGE_VARIANTS: Record<EventStatus, BadgeVariant> = {
  draft: "default",
  published: "success",
  ongoing: "warning",
  completed: "primary",
  cancelled: "danger",
};

interface DisplayStatusInput {
  status: EventStatus;
  startsAt: number;
  endsAt?: number;
  now?: number;
}

export function resolveDisplayStatus({
  status,
  startsAt,
  endsAt,
  now = Date.now(),
}: DisplayStatusInput): EventStatus {
  if (status !== "published") return status;
  if (endsAt !== undefined && now >= startsAt && now <= endsAt) return "ongoing";
  return status;
}

export function getStatusLabel(status: EventStatus): string {
  return STATUS_LABELS[status];
}

export function getStatusBadgeVariant(status: EventStatus): BadgeVariant {
  return STATUS_BADGE_VARIANTS[status];
}
