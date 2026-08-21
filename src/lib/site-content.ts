import { useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ValueItem = { id: string; icon: string; title: string; text: string };
export type Leader = {
  id: string;
  icon: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
};
export type Ministry = { id: string; icon: string; title: string; text: string; items: string };
export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  time: string;
  details: string;
  featured: boolean;
};
export type Sermon = {
  id: string;
  title: string;
  text: string;
  category: string;
  link: string;
};
export type GalleryItem = { id: string; icon: string; caption: string; category: string; image: string };
export type Testimony = { id: string; text: string; author: string };
export type NewsItem = { id: string; date: string; title: string; text: string };

export type SiteContent = {
  settings: {
    siteName: string;
    logo: string;
    subtitle: string;
    verseText: string;
    verseRef: string;
    adminPassword: string;
    whatsapp: string;
    flutterwaveKey: string;
    currency: string;
    momoCode: string;
    bankName: string;
    bankAccount: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    hours: string;
    mapEmbed: string;
    facebook: string;
    youtube: string;
    instagram: string;
    tiktok: string;
  };
  about: { intro: string; vision: string; mission: string };
  values: ValueItem[];
  leaders: Leader[];
  ministries: Ministry[];
  events: EventItem[];
  sermons: Sermon[];
  gallery: GalleryItem[];
  testimonies: Testimony[];
  news: NewsItem[];
};

export type Member = {
  id: string;
  image?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  interest: string;
  date: string;
};
export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
};
export type Prayer = { id: string; name: string; email: string; request: string; date: string };
export type Subscriber = { id: string; email: string; date: string };
export type Donation = {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  reference: string;
  status: string;
  date: string;
};

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

export const uid = () => Math.random().toString(36).slice(2, 10);

export const defaultContent: SiteContent = {
  settings: {
    siteName: "FAMILY IMBUTO Z'AGAKIZA",
    logo: "",
    subtitle:
      "Spreading the good news of Jesus Christ, helping the needy, and building lives grounded in God.",
    verseText: "\u201cFor the Son of Man came to seek and to save the lost.\u201d",
    verseRef: "Luke 19:10",
    adminPassword: "",
    whatsapp: "250727777791",
    flutterwaveKey: "",
    currency: "RWF",
    momoCode: "*182*8*1*123456#",
    bankName: "Bank of Kigali",
    bankAccount: "00000-00000000-00",
    address: "Kigali, Rwanda",
    phone: "+250727777791",
    email: "familyimbutozagakiza@gmail.com",
    website: "www.familyimbuto.org",
    hours: "Monday \u2013 Friday: 08:00 \u2013 17:00",
    mapEmbed:
      "https://www.google.com/maps?q=Kigali,Rwanda&output=embed",
    facebook: "#",
    youtube: "#",
    instagram: "#",
    tiktok: "#",
  },
  about: {
    intro:
      "FAMILY IMBUTO Z'AGAKIZA is a Christian organization established to spread the good news of Jesus Christ, support the poor and vulnerable, visit the sick, orphans, and widows, and help people recover from drug addiction.",
    vision: "To see all people come to know Christ and live a full life in salvation.",
    mission:
      "Proclaim the good news of Jesus Christ\nPray and equip people with God's word\nEngage in acts of love and compassion\nSupport youth and families\nBuild fellowship among believers",
  },
  values: [
    { id: uid(), icon: "\u271D\uFE0F", title: "Faith", text: "Trusting God in everything" },
    { id: uid(), icon: "\u2764\uFE0F", title: "Love", text: "Loving God and people" },
    { id: uid(), icon: "\u2B50", title: "Holiness", text: "Living set apart" },
    { id: uid(), icon: "\uD83E\uDD1D", title: "Service", text: "Serving others" },
    { id: uid(), icon: "\uD83D\uDC65", title: "Unity", text: "One family in Christ" },
    { id: uid(), icon: "\u2713", title: "Integrity", text: "Honesty in all things" },
  ],
  leaders: [
    {
      id: uid(),
      icon: "\uD83D\uDC64",
      name: "NIYITANGA FABRICE",
      role: "Founder & President",
      bio: "Founder and President of Family Imbuto Z'Agakiza",
    },
    {
      id: uid(),
      icon: "\uD83D\uDC64",
      name: "S. MUHOZA JEANCHRISOSTOME",
      role: "Vice President",
      bio: "",
    },
    { id: uid(), icon: "\uD83D\uDCCB", name: "Secretariat", role: "Secretaries", bio: "" },
    { id: uid(), icon: "\uD83D\uDCB0", name: "Finance Department", role: "Finance Officers", bio: "" },
    { id: uid(), icon: "\uD83D\uDCE2", name: "Evangelism Team", role: "Evangelists", bio: "" },
  ],
  ministries: [
    {
      id: uid(),
      icon: "\uD83D\uDCE2",
      title: "Evangelism",
      text: "Preaching the Gospel in churches, streets, and crusades.",
      items: "",
    },
    {
      id: uid(),
      icon: "\uD83D\uDE4F",
      title: "Prayer Ministries",
      text: "",
      items: "Night vigils\nPrayers for the sick\nPrayers for families\nPrayers for youth",
    },
    {
      id: uid(),
      icon: "\uD83C\uDFB5",
      title: "Worship Ministries",
      text: "Worship and praise songs to honor God.",
      items: "",
    },
    {
      id: uid(),
      icon: "\uD83D\uDC9D",
      title: "Compassion & Outreach",
      text: "",
      items:
        "Visiting orphans\nVisiting the sick\nSupporting the needy\nProviding school supplies",
    },
    {
      id: uid(),
      icon: "\uD83D\uDC65",
      title: "Youth Ministries",
      text: "",
      items: "Youth mentorship\nFighting substance abuse\nDeveloping talents",
    },
  ],
  events: [
    {
      id: uid(),
      title: "JESUS IS REAL GOSPEL CRUSADE",
      date: "16 August 2026",
      location: "Kigali Great Hotel, Kiyovu",
      time: "10:00 AM",
      details: "Guest Preachers \u2022 Worship Team",
      featured: true,
    },
  ],
  sermons: [
    {
      id: uid(),
      title: "Jeremiah 1:5",
      text: "Life and God's Purpose",
      category: "video",
      link: "",
    },
  ],
  gallery: [
    { id: uid(), icon: "\uD83D\uDCF8", caption: "Crusade Event", category: "crusades", image: "" },
    { id: uid(), icon: "\uD83D\uDE4F", caption: "Prayer Meeting", category: "prayer", image: "" },
    { id: uid(), icon: "\uD83C\uDFB5", caption: "Worship Service", category: "worship", image: "" },
    { id: uid(), icon: "\uD83D\uDC9D", caption: "Charity Work", category: "charity", image: "" },
  ],
  testimonies: [
    {
      id: uid(),
      text: "After joining the prayer sessions of Family Imbuto Z'Agakiza, God healed my illness and granted me peace.",
      author: "Member Testimony",
    },
  ],
  news: [
    {
      id: uid(),
      date: "Aug 2026",
      title: "Conference Announcement",
      text: "The annual leadership conference is approaching soon.",
    },
    {
      id: uid(),
      date: "Jul 2026",
      title: "New Prayer Program",
      text: "Weekly prayer sessions have launched this month.",
    },
    {
      id: uid(),
      date: "Jul 2026",
      title: "Mission Report",
      text: "Outcomes from our recent outreach mission.",
    },
  ],
};

export const SERMON_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "video", label: "Video Sermons" },
  { key: "audio", label: "Audio Sermons" },
  { key: "written", label: "Written Sermons" },
  { key: "bible", label: "Bible Studies" },
];

export const GALLERY_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "crusades", label: "Crusades" },
  { key: "prayer", label: "Prayer Meetings" },
  { key: "worship", label: "Worship" },
  { key: "charity", label: "Charity" },
  { key: "conferences", label: "Conferences" },
  { key: "youth", label: "Youth Events" },
];

/* ------------------------------------------------------------------ */
/* Cloud storage (shared by every visitor)                             */
/* ------------------------------------------------------------------ */

import { supabase } from "@/integrations/supabase/client";
import {
  saveSiteContent,
  listSubmissions,
  addSubmissionAsAdmin,
  deleteSubmission,
  clearSubmissions,
} from "./site.functions";

const PW_KEY = "fiz_admin_pw";

export function getAdminPassword(): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(PW_KEY) ?? "";
}

export function setAdminPassword(pw: string) {
  window.sessionStorage.setItem(PW_KEY, pw);
}

function mergeContent(saved: Partial<SiteContent> | null): SiteContent {
  if (!saved) return defaultContent;
  return {
    ...defaultContent,
    ...saved,
    settings: { ...defaultContent.settings, ...(saved.settings ?? {}), adminPassword: "" },
    about: { ...defaultContent.about, ...(saved.about ?? {}) },
  };
}

export async function fetchContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", "main")
    .maybeSingle();
  if (error || !data) return defaultContent;
  return mergeContent(data.data as Partial<SiteContent>);
}

/** Loads shared website content and keeps it live for every visitor. */
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    let active = true;
    const sync = () => {
      void fetchContent().then((c) => {
        if (active) setContent(c);
      });
    };
    sync();

    const channel = supabase
      .channel("site_content_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => sync(),
      )
      .subscribe();

    window.addEventListener("focus", sync);
    return () => {
      active = false;
      window.removeEventListener("focus", sync);
      void supabase.removeChannel(channel);
    };
  }, []);

  const save = useCallback(async (next: SiteContent) => {
    const password = getAdminPassword();
    const result = await saveSiteContent({
      data: { password, content: next as unknown as Record<string, never> },
    });
    if (result.password) setAdminPassword(result.password);
    setContent(mergeContent(next));
  }, []);

  return { content, save };
}

/* --- submissions -------------------------------------------------- */

export const STORE_KEYS = {
  members: "members",
  messages: "messages",
  prayers: "prayers",
  newsletter: "newsletter",
  donations: "donations",
} as const;

export type StoreKey = keyof typeof STORE_KEYS;

/** Public form submissions — anyone can send these. */
export async function addToStore<T extends { id: string }>(key: StoreKey, row: T) {
  const { id: _id, ...payload } = row;
  const { error } = await supabase.from("submissions").insert({
    kind: key,
    payload: payload as unknown as Record<string, never>,
  });
  if (error) throw new Error("Could not send. Please try again.");
}

type Row = { id: string; kind: StoreKey; payload: Record<string, unknown>; created_at: string };

function toRow<T>(r: Row): T {
  return { ...(r.payload as object), id: r.id, date: (r.payload["date"] as string) ?? r.created_at } as T;
}

/** Admin-only listing of submissions. */
export function useStore<T extends { id: string }>(key: StoreKey) {
  const [rows, setRows] = useState<T[]>([]);

  const load = useCallback(async () => {
    const password = getAdminPassword();
    if (!password) return;
    try {
      const all = (await listSubmissions({ data: { password } })) as unknown as Row[];
      setRows(all.filter((r) => r.kind === key).map((r) => toRow<T>(r)));
    } catch {
      /* not authorised yet */
    }
  }, [key]);

  useEffect(() => {
    void load();
  }, [load]);

  const add = useCallback(
    async (row: T) => {
      const { id: _id, ...payload } = row;
      await addSubmissionAsAdmin({
        data: {
          password: getAdminPassword(),
          kind: key,
          payload: payload as unknown as Record<string, never>,
        },
      });
      await load();
    },
    [key, load],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteSubmission({ data: { password: getAdminPassword(), id } });
      await load();
    },
    [load],
  );

  const clear = useCallback(async () => {
    await clearSubmissions({ data: { password: getAdminPassword(), kind: key } });
    await load();
  }, [key, load]);

  return { rows, add, remove, clear, reload: load };
}

export const now = () => new Date().toLocaleString();
