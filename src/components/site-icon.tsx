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
  const Icon = icons[inferIcon(name, label)] ?? Sparkles;
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={strokeWidth} />;
}