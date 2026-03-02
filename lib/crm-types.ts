export type ContactStatus = "cold" | "warm" | "hot" | "active" | "won" | "lost";
export type PropertyType = "apartment" | "house" | "cabin" | "commercial" | "land" | "other";
export type ContactPropertyRelationship = "owner" | "past_owner" | "interested" | "viewed" | "bidder" | "neighbor" | "heir";

export interface Property {
  id: string;
  agent_email: string;
  address: string;
  postal_code: string;
  city: string;
  property_type: PropertyType;
  size_sqm: number | null;
  estimated_value: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
  event_count?: number;
  contact_count?: number;
  last_event_at?: string | null;
  contacts?: ContactPropertyLink[];
}

export interface ContactPropertyLink {
  id: string;
  contact_id: string;
  property_id: string;
  relationship: ContactPropertyRelationship;
  notes: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  status?: ContactStatus;
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: "Leilighet",
  house: "Enebolig/Rekkehus",
  cabin: "Hytte/Fritidseiendom",
  commercial: "Næringseiendom",
  land: "Tomt",
  other: "Annet",
};

export const RELATIONSHIP_LABELS: Record<ContactPropertyRelationship, string> = {
  owner: "Eier",
  past_owner: "Tidligere eier",
  interested: "Interessent",
  viewed: "Var på visning",
  bidder: "Ga bud",
  neighbor: "Nabo",
  heir: "Arving",
};
export type ContactType = "seller" | "buyer" | "investor" | "heir" | "renter" | "unknown";

export interface Contact {
  id: string;
  agent_email: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  status: ContactStatus;
  type: ContactType;
  source: string;
  notes: string;
  next_contact: string | null;
  created_at: string;
  updated_at: string;
  last_event_at?: string | null;
  event_count?: number;
}

export interface CrmEvent {
  id: string;
  agent_email: string;
  contact_id: string;
  event_type: EventType;
  address: string;
  notes: string;
  outcome: "positive" | "negative" | "neutral" | "no_answer";
  next_action_date: string | null;
  next_action_note: string;
  completed_at: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

export type EventType =
  | "phone_call" | "email" | "sms" | "meeting"
  | "valuation" | "private_viewing" | "open_house"
  | "bidding" | "contract_meeting" | "handover"
  | "market_report" | "christmas_card" | "referral"
  | "note" | "no_answer";

export const STATUS_LABELS: Record<ContactStatus, string> = {
  cold: "Kald",
  warm: "Lunken",
  hot: "Varm",
  active: "Aktiv",
  won: "Vunnet",
  lost: "Tapt",
};

export const STATUS_COLORS: Record<ContactStatus, string> = {
  cold: "bg-gray-800 text-gray-400 border-gray-700",
  warm: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
  hot: "bg-orange-900/30 text-orange-400 border-orange-700/30",
  active: "bg-green-900/30 text-green-400 border-green-700/30",
  won: "bg-blue-900/30 text-blue-400 border-blue-700/30",
  lost: "bg-red-900/20 text-red-500 border-red-700/20",
};

export const TYPE_LABELS: Record<ContactType, string> = {
  seller: "Selger",
  buyer: "Kjøper",
  investor: "Investor",
  heir: "Arving",
  renter: "Leietaker",
  unknown: "Ukjent",
};

export const EVENT_TYPES: { value: EventType; label: string; emoji: string }[] = [
  { value: "phone_call", label: "Telefonsamtale", emoji: "📞" },
  { value: "no_answer", label: "Ikke svar", emoji: "❌" },
  { value: "sms", label: "SMS", emoji: "💬" },
  { value: "email", label: "E-post", emoji: "✉️" },
  { value: "meeting", label: "Møte", emoji: "🤝" },
  { value: "valuation", label: "Verdivurdering", emoji: "🏠" },
  { value: "private_viewing", label: "Privatvisning", emoji: "👁️" },
  { value: "open_house", label: "Fellesvisning", emoji: "🏘️" },
  { value: "bidding", label: "Budrunde", emoji: "🔨" },
  { value: "contract_meeting", label: "Kontraktsmøte", emoji: "📝" },
  { value: "handover", label: "Overlevering", emoji: "🔑" },
  { value: "market_report", label: "Markedsrapport sendt", emoji: "📊" },
  { value: "christmas_card", label: "Julekort/gave", emoji: "🎄" },
  { value: "referral", label: "Henvisning", emoji: "🔗" },
  { value: "note", label: "Notat", emoji: "📌" },
];

export function getEventLabel(type: EventType): string {
  return EVENT_TYPES.find((e) => e.value === type)?.label ?? type;
}

export function getEventEmoji(type: EventType): string {
  return EVENT_TYPES.find((e) => e.value === type)?.emoji ?? "📌";
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" });
}

export function formatRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "I dag";
  if (diffDays === 1) return "I går";
  if (diffDays < 7) return `${diffDays} dager siden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} uker siden`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} mnd siden`;
  return `${Math.floor(diffDays / 365)} år siden`;
}

export function daysSince(dateStr: string | null | undefined): number {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}
