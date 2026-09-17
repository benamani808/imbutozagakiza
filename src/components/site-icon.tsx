import {
  ArrowUp,
  BadgeCheck,
  Banknote,
  BookOpen,
  CalendarDays,
  Camera,
  ChartNoAxesColumnIncreasing,
  Church,
  CircleDollarSign,
  Clock3,
  Cross,
  DoorOpen,
  Facebook,
  GalleryHorizontalEnd,
  Globe2,
  HandHeart,
  Heart,
  HeartHandshake,
  House,
  Instagram,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  MessagesSquare,
  Mic2,
  Music2,
  Newspaper,
  Phone,
  RefreshCw,
  Settings,
  Smartphone,
  Sparkles,
  UserRound,
  Users,
  Video,
  WalletCards,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import type { SVGProps } from "react";

function WhatsAppMark({ className, width, height }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M27.28 4.68A15.77 15.77 0 0 0 16.05 0C7.32 0 .22 7.1.22 15.83c0 2.79.73 5.51 2.11 7.91L.09 31.93l8.38-2.2a15.8 15.8 0 0 0 7.57 1.93h.01c8.73 0 15.83-7.1 15.83-15.83 0-4.23-1.63-8.19-4.6-11.15Zm-11.23 24.3h-.01a13.1 13.1 0 0 1-6.68-1.83l-.48-.28-4.97 1.3 1.33-4.84-.31-.5a13.1 13.1 0 0 1-2.01-7c0-7.24 5.89-13.13 13.14-13.13 3.5 0 6.8 1.37 9.28 3.85a13.04 13.04 0 0 1 3.84 9.29c-.01 7.24-5.9 13.14-13.13 13.14Zm7.2-9.84c-.39-.2-2.33-1.15-2.69-1.28-.36-.13-.62-.2-.88.2-.26.39-1.02 1.28-1.25 1.54-.23.26-.46.3-.85.1-.4-.2-1.67-.61-3.18-1.96a11.94 11.94 0 0 1-2.2-2.74c-.23-.4-.02-.61.17-.8.18-.17.4-.46.6-.69.2-.23.26-.39.39-.65.13-.26.07-.49-.03-.69-.1-.2-.89-2.14-1.22-2.93-.32-.77-.65-.66-.89-.67h-.76c-.26 0-.69.1-1.05.49-.36.39-1.38 1.35-1.38 3.29s1.41 3.82 1.61 4.08c.2.26 2.78 4.24 6.73 5.95.94.4 1.67.65 2.25.83.94.3 1.8.26 2.48.16.76-.11 2.33-.95 2.66-1.87.33-.92.33-1.71.23-1.87-.1-.17-.36-.27-.75-.46Z" />
    </svg>
  );
}

const icons: Record<string, LucideIcon> = {
  arrowUp: ArrowUp,
  bank: Landmark,
  bible: BookOpen,
  calendar: CalendarDays,
  camera: Camera,
  chart: ChartNoAxesColumnIncreasing,
  church: Church,
  close: RefreshCw,
  cross: Cross,
  donation: CircleDollarSign,
  email: Mail,
  facebook: Facebook,
  gallery: GalleryHorizontalEnd,
  globe: Globe2,
  heart: Heart,
  integrity: BadgeCheck,
  leadership: UserRound,
  lock: LockKeyhole,
  logout: DoorOpen,
  love: HeartHandshake,
  menu: Menu,
  messages: MessagesSquare,
  microphone: Mic2,
  ministries: Church,
  mobile: Smartphone,
  music: Music2,
  news: Newspaper,
  overview: LayoutDashboard,
  payment: WalletCards,
  phone: Phone,
  prayer: HandHeart,
  recurring: RefreshCw,
  settings: Settings,
  sparkles: Sparkles,
  time: Clock3,
  user: UserRound,
  users: Users,
  video: Video,
  website: House,
  whatsapp: MessageCircle,
  youtube: Youtube,
  instagram: Instagram,
  location: MapPin,
  money: Banknote,
};

const legacyIcons: Record<string, keyof typeof icons> = {
  "✝️": "cross",
  "✝": "cross",
  "❤️": "love",
  "❤": "love",
  "⭐": "sparkles",
  "🤝": "love",
  "👥": "users",
  "✓": "integrity",
  "👤": "user",
  "📋": "overview",
  "💰": "money",
  "📢": "overview",
  "🙏": "prayer",
  "🎵": "music",
  "💝": "love",
  "📸": "camera",
};

function inferIcon(value: string, label: string) {
  const direct = legacyIcons[value] ?? value;
  if (icons[direct]) return direct;

  const text = `${value} ${label}`.toLowerCase();
  if (text.includes("faith") || text.includes("christ")) return "cross";
  if (text.includes("love") || text.includes("compassion") || text.includes("charity")) return "love";
  if (text.includes("prayer")) return "prayer";
  if (text.includes("worship") || text.includes("music")) return "music";
  if (text.includes("youth") || text.includes("unity") || text.includes("member")) return "users";
  if (text.includes("evangel") || text.includes("crusade")) return "overview";
  if (text.includes("integrity") || text.includes("holiness")) return "integrity";
  if (text.includes("leader") || text.includes("pastor")) return "user";
  if (text.includes("photo") || text.includes("gallery")) return "camera";
  return "sparkles";
}

export const ICON_OPTIONS = [
  ["cross", "Cross"],
  ["heart", "Heart"],
  ["love", "Helping hands"],
  ["sparkles", "Sparkles"],
  ["integrity", "Integrity badge"],
  ["users", "People"],
  ["user", "Person"],
  ["church", "Church"],
  ["prayer", "Prayer"],
  ["music", "Music"],
  ["overview", "Announcement"],
  ["camera", "Camera"],
] as [string, string][];

export function SiteIcon({
  name,
  label = "",
  size = 22,
  strokeWidth = 1.8,
  className,
}: {
  name: string;
  label?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const resolvedName = inferIcon(name, label);
  if (resolvedName === "whatsapp") {
    return <WhatsAppMark className={className} width={size} height={size} />;
  }
  const Icon = icons[resolvedName] ?? Sparkles;
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={strokeWidth} />;
}