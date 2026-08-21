import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import {
  GALLERY_CATEGORIES,
  SERMON_CATEGORIES,
  defaultContent,
  getAdminPassword,
  now,
  setAdminPassword,
  uid,
  useSiteContent,
  useStore,
  type Donation,
  type EventItem,
  type GalleryItem,
  type Leader,
  type Member,
  type Message,
  type Ministry,
  type NewsItem,
  type Prayer,
  type Sermon,
  type SiteContent,
  type Subscriber,
  type Testimony,
  type ValueItem,
} from "@/lib/site-content";
import { verifyAdmin } from "@/lib/site.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | Family Imbuto Z'Agakiza" },
      {
        name: "description",
        content:
          "Private admin dashboard for Family Imbuto Z'Agakiza: manage website content, events, sermons, gallery, members, messages and donations.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel | Family Imbuto Z'Agakiza" },
      {
        property: "og:description",
        content: "Private dashboard for managing the Family Imbuto Z'Agakiza website.",
      },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  ["overview", "📊 Overview"],
  ["general", "🏠 Home & About"],
  ["leaders", "👤 Leadership"],
  ["ministries", "⛪ Ministries"],
  ["events", "📅 Events"],
  ["sermons", "📖 Sermons"],
  ["gallery", "🖼️ Gallery"],
  ["testimonies", "✨ Testimonies"],
  ["news", "📰 News"],
  ["members", "👥 Members"],
  ["messages", "✉️ Messages"],
  ["prayers", "🙏 Prayers"],
  ["newsletter", "📧 Newsletter"],
  ["donations", "💳 Donations"],
  ["settings", "⚙️ Settings"],
] as const;

type TabKey = (typeof TABS)[number][0];

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem("fiz_admin") === "true" && getAdminPassword() !== "");
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const pass = String(f.get("password") ?? "");
    setBusy(true);
    setError("");
    try {
      const res = await verifyAdmin({ data: { password: pass } });
      if (String(f.get("username") ?? "") === "admin" && res.ok) {
        sessionStorage.setItem("fiz_admin", "true");
        setAdminPassword(pass);
        onSuccess();
      } else {
        setError("Username cyangwa Password ntabwo ari byo!");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>\uD83D\uDD12 System Login</h2>
        <p className="sub">FAMILY IMBUTO Z'AGAKIZA \u2014 Admin Panel</p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="a-user">Username</label>
            <input id="a-user" name="username" defaultValue="admin" required />
          </div>
          <div className="field">
            <label htmlFor="a-pass">Password</label>
            <input id="a-pass" name="password" type="password" required />
          </div>
          <p className="error-text">{error}</p>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? "Checking\u2026" : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: ".85rem" }}>
          <Link to="/">\u2190 Back to website</Link>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { content, save } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [tab, setTab] = useState<TabKey>("overview");
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(content), [content]);

  const members = useStore<Member>("members");
  const messages = useStore<Message>("messages");
  const prayers = useStore<Prayer>("prayers");
  const newsletter = useStore<Subscriber>("newsletter");
  const donations = useStore<Donation>("donations");

  const [error, setError] = useState("");

  const commit = async () => {
    try {
      setError("");
      await save(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      members.reload();
      messages.reload();
      prayers.reload();
      newsletter.reload();
      donations.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    }
  };

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const label = TABS.find(([k]) => k === tab)?.[1] ?? "";
  const isContentTab = ![
    "overview",
    "members",
    "messages",
    "prayers",
    "newsletter",
    "donations",
  ].includes(tab);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <p className="sub">Imbuto Z'Agakiza</p>
        <nav className="admin-nav">
          {TABS.map(([key, text]) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => setTab(key as TabKey)}
            >
              {text}
            </button>
          ))}
          <Link to="/" style={{ display: "block", padding: ".6rem .8rem", color: "#fff", fontSize: ".92rem" }}>
            🌍 View website
          </Link>
          <button
            className="logout"
            onClick={() => {
              sessionStorage.removeItem("fiz_admin");
              onLogout();
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{label.replace(/^\S+\s/, "")}</h1>
            <p>{new Date().toLocaleDateString(undefined, { dateStyle: "full" })}</p>
          </div>
        </header>

        {tab === "overview" ? (
          <>
            <div className="stat-grid">
              <Stat num={members.rows.length} label="Members" />
              <Stat num={messages.rows.length} label="Messages" />
              <Stat num={prayers.rows.length} label="Prayer Requests" />
              <Stat num={newsletter.rows.length} label="Subscribers" />
              <Stat num={donations.rows.length} label="Donations" />
              <Stat
                num={donations.rows.reduce((sum, d) => sum + Number(d.amount || 0), 0)}
                label={`Total given (${content.settings.currency})`}
              />
            </div>
            <div className="panel">
              <h3>Latest messages</h3>
              <Table
                head={["Name", "Subject", "Date"]}
                rows={messages.rows.slice(0, 5).map((m) => [m.name, m.subject, m.date])}
              />
            </div>
          </>
        ) : null}

        {tab === "general" ? (
          <>
            <div className="panel">
              <h3>Logo</h3>
              <ImagePicker
                value={draft.settings.logo}
                onChange={(v) => update("settings", { ...draft.settings, logo: v })}
              />
            </div>

            <div className="panel">
              <h3>Hero</h3>
              <div className="field-grid">
                <Text
                  label="Site name"
                  value={draft.settings.siteName}
                  onChange={(v) => update("settings", { ...draft.settings, siteName: v })}
                />
                <Text
                  label="Verse reference"
                  value={draft.settings.verseRef}
                  onChange={(v) => update("settings", { ...draft.settings, verseRef: v })}
                />
              </div>
              <Area
                label="Subtitle"
                value={draft.settings.subtitle}
                onChange={(v) => update("settings", { ...draft.settings, subtitle: v })}
              />
              <Area
                label="Theme verse"
                value={draft.settings.verseText}
                onChange={(v) => update("settings", { ...draft.settings, verseText: v })}
              />
            </div>
            <div className="panel">
              <h3>About</h3>
              <Area
                label="Introduction"
                value={draft.about.intro}
                onChange={(v) => update("about", { ...draft.about, intro: v })}
              />
              <Area
                label="Vision"
                value={draft.about.vision}
                onChange={(v) => update("about", { ...draft.about, vision: v })}
              />
              <Area
                label="Mission (one item per line)"
                rows={6}
                value={draft.about.mission}
                onChange={(v) => update("about", { ...draft.about, mission: v })}
              />
            </div>
            <ListEditor<ValueItem>
              title="Core values"
              rows={draft.values}
              onChange={(rows) => update("values", rows)}
              blank={() => ({ id: uid(), icon: "✝️", title: "New value", text: "" })}
              titleOf={(r) => r.title}
              fields={[
                { key: "icon", label: "Icon (emoji)" },
                { key: "title", label: "Title" },
                { key: "text", label: "Description" },
              ]}
            />
          </>
        ) : null}

        {tab === "leaders" ? (
          <ListEditor<Leader>
            title="Leadership"
            rows={draft.leaders}
            onChange={(rows) => update("leaders", rows)}
            blank={() => ({ id: uid(), icon: "👤", name: "New leader", role: "", bio: "" })}
            titleOf={(r) => r.name}
            fields={[
              { key: "image", label: "Photo", image: true },
              { key: "icon", label: "Fallback icon (emoji)" },
              { key: "name", label: "Name" },
              { key: "role", label: "Role" },
              { key: "bio", label: "Short bio", area: true },
            ]}
          />
        ) : null}

        {tab === "ministries" ? (
          <ListEditor<Ministry>
            title="Ministries"
            rows={draft.ministries}
            onChange={(rows) => update("ministries", rows)}
            blank={() => ({ id: uid(), icon: "⛪", title: "New ministry", text: "", items: "" })}
            titleOf={(r) => r.title}
            fields={[
              { key: "icon", label: "Icon (emoji)" },
              { key: "title", label: "Title" },
              { key: "text", label: "Description", area: true },
              { key: "items", label: "Bullet list (one per line)", area: true },
            ]}
          />
        ) : null}

        {tab === "events" ? (
          <ListEditor<EventItem>
            title="Events & programs"
            rows={draft.events}
            onChange={(rows) => update("events", rows)}
            blank={() => ({
              id: uid(),
              title: "New event",
              date: "",
              location: "",
              time: "",
              details: "",
              featured: false,
            })}
            titleOf={(r) => r.title}
            fields={[
              { key: "title", label: "Title" },
              { key: "date", label: "Date" },
              { key: "location", label: "Location" },
              { key: "time", label: "Time" },
              { key: "details", label: "Details", area: true },
              { key: "featured", label: "Mark as upcoming", checkbox: true },
            ]}
          />
        ) : null}

        {tab === "sermons" ? (
          <ListEditor<Sermon>
            title="Sermons"
            rows={draft.sermons}
            onChange={(rows) => update("sermons", rows)}
            blank={() => ({ id: uid(), title: "New sermon", text: "", category: "video", link: "" })}
            titleOf={(r) => r.title}
            fields={[
              { key: "title", label: "Title" },
              { key: "text", label: "Description" },
              {
                key: "category",
                label: "Category",
                options: SERMON_CATEGORIES.filter((c) => c.key !== "all").map((c) => [c.key, c.label]),
              },
              { key: "link", label: "Video / audio / PDF link" },
            ]}
          />
        ) : null}

        {tab === "gallery" ? (
          <ListEditor<GalleryItem>
            title="Gallery"
            rows={draft.gallery}
            onChange={(rows) => update("gallery", rows)}
            blank={() => ({ id: uid(), icon: "📸", caption: "New photo", category: "crusades", image: "" })}
            titleOf={(r) => r.caption}
            fields={[
              { key: "caption", label: "Caption" },
              {
                key: "category",
                label: "Category",
                options: GALLERY_CATEGORIES.filter((c) => c.key !== "all").map((c) => [c.key, c.label]),
              },
              { key: "image", label: "Photo", image: true },
              { key: "icon", label: "Fallback icon (emoji)" },
            ]}
          />
        ) : null}

        {tab === "testimonies" ? (
          <ListEditor<Testimony>
            title="Testimonies"
            rows={draft.testimonies}
            onChange={(rows) => update("testimonies", rows)}
            blank={() => ({ id: uid(), text: "", author: "Member Testimony" })}
            titleOf={(r) => r.author}
            fields={[
              { key: "text", label: "Testimony", area: true },
              { key: "author", label: "Author" },
            ]}
          />
        ) : null}

        {tab === "news" ? (
          <ListEditor<NewsItem>
            title="News & updates"
            rows={draft.news}
            onChange={(rows) => update("news", rows)}
            blank={() => ({ id: uid(), date: "", title: "New post", text: "" })}
            titleOf={(r) => r.title}
            fields={[
              { key: "date", label: "Date label" },
              { key: "title", label: "Title" },
              { key: "text", label: "Body", area: true },
            ]}
          />
        ) : null}

        {tab === "members" ? (
          <div className="panel">
            <h3>Membership requests</h3>
            <QuickAdd
              submitLabel="Add member"
              fields={[
                { key: "image", label: "Member photo", image: true },
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "location", label: "Location" },
                { key: "interest", label: "Interest" },
              ]}
              onAdd={(v) =>
                members.add({
                  id: uid(),
                  image: (v["image"] ?? ""),
                  name: (v["name"] ?? ""),
                  email: (v["email"] ?? ""),
                  phone: (v["phone"] ?? ""),
                  location: (v["location"] ?? ""),
                  interest: (v["interest"] ?? ""),
                  date: now(),
                })
              }
            />
            <Table
              head={["Photo", "Name", "Email", "Phone", "Location", "Interest", "Date", ""]}
              rows={members.rows.map((m) => [
                m.image ? (
                  <img
                    key={`${m.id}-img`}
                    src={m.image}
                    alt={m.name}
                    style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  "—"
                ),
                m.name,
                m.email,
                m.phone,
                m.location,
                m.interest,
                m.date,
                <button key={m.id} className="btn btn-danger btn-small" onClick={() => members.remove(m.id)}>
                  Delete
                </button>,
              ])}
            />
          </div>
        ) : null}

        {tab === "messages" ? (
          <div className="panel">
            <h3>Contact messages</h3>
            <Table
              head={["Name", "Email", "Subject", "Message", "Date", ""]}
              rows={messages.rows.map((m) => [
                m.name,
                m.email,
                m.subject,
                m.message,
                m.date,
                <button key={m.id} className="btn btn-danger btn-small" onClick={() => messages.remove(m.id)}>
                  Delete
                </button>,
              ])}
            />
          </div>
        ) : null}

        {tab === "prayers" ? (
          <div className="panel">
            <h3>Prayer requests</h3>
            <QuickAdd
              submitLabel="Add prayer request"
              fields={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "request", label: "Request", area: true },
              ]}
              onAdd={(v) =>
                prayers.add({
                  id: uid(),
                  name: (v["name"] ?? ""),
                  email: (v["email"] ?? ""),
                  request: (v["request"] ?? ""),
                  date: now(),
                })
              }
            />
            <Table
              head={["Name", "Email", "Request", "Date", ""]}
              rows={prayers.rows.map((p) => [
                p.name,
                p.email,
                p.request,
                p.date,
                <button key={p.id} className="btn btn-danger btn-small" onClick={() => prayers.remove(p.id)}>
                  Delete
                </button>,
              ])}
            />
          </div>
        ) : null}

        {tab === "newsletter" ? (
          <div className="panel">
            <h3>Newsletter subscribers</h3>
            <QuickAdd
              submitLabel="Add subscriber"
              fields={[{ key: "email", label: "Email" }]}
              onAdd={(v) => newsletter.add({ id: uid(), email: (v["email"] ?? ""), date: now() })}
            />
            <Table
              head={["Email", "Date", ""]}
              rows={newsletter.rows.map((n) => [
                n.email,
                n.date,
                <button key={n.id} className="btn btn-danger btn-small" onClick={() => newsletter.remove(n.id)}>
                  Delete
                </button>,
              ])}
            />
          </div>
        ) : null}

        {tab === "donations" ? (
          <div className="panel">
            <h3>Donations</h3>
            <QuickAdd
              submitLabel="Record donation"
              fields={[
                { key: "name", label: "Donor name" },
                { key: "email", label: "Email" },
                { key: "amount", label: "Amount" },
                { key: "currency", label: "Currency", initial: draft.settings.currency },
                { key: "reference", label: "Reference (optional)" },
                { key: "status", label: "Status", initial: "completed" },
              ]}
              onAdd={(v) =>
                donations.add({
                  id: uid(),
                  name: (v["name"] ?? ""),
                  email: (v["email"] ?? ""),
                  amount: Number((v["amount"] ?? "")) || 0,
                  currency: (v["currency"] ?? "") || draft.settings.currency,
                  reference: (v["reference"] ?? "") || `MANUAL-${Date.now()}`,
                  status: (v["status"] ?? "") || "completed",
                  date: now(),
                })
              }
            />
            <Table
              head={["Name", "Email", "Amount", "Reference", "Status", "Date", ""]}
              rows={donations.rows.map((d) => [
                d.name,
                d.email,
                `${d.amount} ${d.currency}`,
                d.reference,
                d.status,
                d.date,
                <button key={d.id} className="btn btn-danger btn-small" onClick={() => donations.remove(d.id)}>
                  Delete
                </button>,
              ])}
            />
          </div>
        ) : null}

        {tab === "settings" ? (
          <>
            <div className="panel">
              <h3>Payments</h3>
              <div className="field-grid">
                <Text
                  label="Flutterwave public key (FLWPUBK...)"
                  value={draft.settings.flutterwaveKey}
                  onChange={(v) => update("settings", { ...draft.settings, flutterwaveKey: v })}
                />
                <Text
                  label="Currency"
                  value={draft.settings.currency}
                  onChange={(v) => update("settings", { ...draft.settings, currency: v })}
                />
                <Text
                  label="MoMo code"
                  value={draft.settings.momoCode}
                  onChange={(v) => update("settings", { ...draft.settings, momoCode: v })}
                />
                <Text
                  label="Bank name"
                  value={draft.settings.bankName}
                  onChange={(v) => update("settings", { ...draft.settings, bankName: v })}
                />
                <Text
                  label="Bank account"
                  value={draft.settings.bankAccount}
                  onChange={(v) => update("settings", { ...draft.settings, bankAccount: v })}
                />
              </div>
            </div>
            <div className="panel">
              <h3>Contact & social</h3>
              <div className="field-grid">
                <Text
                  label="Address"
                  value={draft.settings.address}
                  onChange={(v) => update("settings", { ...draft.settings, address: v })}
                />
                <Text
                  label="Phone"
                  value={draft.settings.phone}
                  onChange={(v) => update("settings", { ...draft.settings, phone: v })}
                />
                <Text
                  label="Email"
                  value={draft.settings.email}
                  onChange={(v) => update("settings", { ...draft.settings, email: v })}
                />
                <Text
                  label="Website"
                  value={draft.settings.website}
                  onChange={(v) => update("settings", { ...draft.settings, website: v })}
                />
                <Text
                  label="Working hours"
                  value={draft.settings.hours}
                  onChange={(v) => update("settings", { ...draft.settings, hours: v })}
                />
                <Text
                  label="WhatsApp number (no +)"
                  value={draft.settings.whatsapp}
                  onChange={(v) => update("settings", { ...draft.settings, whatsapp: v })}
                />
                <Text
                  label="Facebook URL"
                  value={draft.settings.facebook}
                  onChange={(v) => update("settings", { ...draft.settings, facebook: v })}
                />
                <Text
                  label="YouTube URL"
                  value={draft.settings.youtube}
                  onChange={(v) => update("settings", { ...draft.settings, youtube: v })}
                />
                <Text
                  label="Instagram URL"
                  value={draft.settings.instagram}
                  onChange={(v) => update("settings", { ...draft.settings, instagram: v })}
                />
                <Text
                  label="TikTok URL"
                  value={draft.settings.tiktok}
                  onChange={(v) => update("settings", { ...draft.settings, tiktok: v })}
                />
              </div>
              <Area
                label="Google map embed URL"
                value={draft.settings.mapEmbed}
                onChange={(v) => update("settings", { ...draft.settings, mapEmbed: v })}
              />
            </div>
            <div className="panel">
              <h3>Security</h3>
              <Text
                label="Admin password"
                value={draft.settings.adminPassword}
                onChange={(v) => update("settings", { ...draft.settings, adminPassword: v })}
              />
              <p className="empty">
                The password is stored securely in the cloud database and checked on the server.
                Changing it here updates it for everyone after you press Save.
              </p>
            </div>
            <div className="panel">
              <h3>Danger zone</h3>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (confirm("Reset all website content to the original text?")) {
                    setDraft(defaultContent);
                    void save(defaultContent);
                  }
                }}
              >
                Reset content to defaults
              </button>
            </div>
          </>
        ) : null}

        {isContentTab ? (
          <div className="save-bar">
            <button className="btn btn-primary" onClick={commit}>
              Save changes
            </button>
            <button className="btn btn-outline" onClick={() => setDraft(content)}>
              Cancel
            </button>
            {saved ? <span className="form-note">Saved — the website is updated.</span> : null}
          </div>
        ) : null}
      </main>
    </div>
  );
}

/* ---------------------------- UI helpers -------------------------- */

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <div className="stat">
      <div className="num">{num}</div>
      <div className="label">{label}</div>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) return <p className="empty">Nothing here yet.</p>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="admin-table">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({
  label,
  value,
  rows = 3,
  onChange,
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

type FieldDef<T> = {
  key: keyof T & string;
  label: string;
  area?: boolean;
  checkbox?: boolean;
  image?: boolean;
  options?: [string, string][];
};

function ListEditor<T extends { id: string }>({
  title,
  rows,
  onChange,
  blank,
  titleOf,
  fields,
}: {
  title: string;
  rows: T[];
  onChange: (rows: T[]) => void;
  blank: () => T;
  titleOf: (row: T) => string;
  fields: FieldDef<T>[];
}) {
  const patch = (id: string, key: string, value: unknown) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const move = (index: number, dir: -1 | 1) => {
    const next = [...rows];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    onChange(next);
  };

  return (
    <div className="panel">
      <h3>{title}</h3>
      {rows.map((row, index) => (
        <div className="row-editor" key={row.id}>
          <div className="row-head">
            <strong>{titleOf(row) || "Untitled"}</strong>
            <span style={{ display: "flex", gap: ".4rem" }}>
              <button className="btn btn-outline btn-small" onClick={() => move(index, -1)}>
                ↑
              </button>
              <button className="btn btn-outline btn-small" onClick={() => move(index, 1)}>
                ↓
              </button>
              <button
                className="btn btn-danger btn-small"
                onClick={() => onChange(rows.filter((r) => r.id !== row.id))}
              >
                Delete
              </button>
            </span>
          </div>
          <div className="field-grid">
            {fields.map((f) => {
              const value = row[f.key] as unknown;
              if (f.checkbox) {
                return (
                  <div className="field" key={f.key}>
                    <label>{f.label}</label>
                    <input
                      type="checkbox"
                      style={{ width: "auto" }}
                      checked={Boolean(value)}
                      onChange={(e) => patch(row.id, f.key, e.target.checked)}
                    />
                  </div>
                );
              }
              if (f.image) {
                return (
                  <div className="field" key={f.key} style={{ gridColumn: "1 / -1" }}>
                    <label>{f.label}</label>
                    <ImagePicker
                      value={String(value ?? "")}
                      onChange={(v) => patch(row.id, f.key, v)}
                    />
                  </div>
                );
              }
              if (f.options) {
                return (
                  <div className="field" key={f.key}>
                    <label>{f.label}</label>
                    <select
                      value={String(value ?? "")}
                      onChange={(e) => patch(row.id, f.key, e.target.value)}
                    >
                      {f.options.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (f.area) {
                return (
                  <div className="field" key={f.key} style={{ gridColumn: "1 / -1" }}>
                    <label>{f.label}</label>
                    <textarea
                      rows={3}
                      value={String(value ?? "")}
                      onChange={(e) => patch(row.id, f.key, e.target.value)}
                    />
                  </div>
                );
              }
              return (
                <div className="field" key={f.key}>
                  <label>{f.label}</label>
                  <input
                    value={String(value ?? "")}
                    onChange={(e) => patch(row.id, f.key, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button className="btn btn-outline" onClick={() => onChange([...rows, blank()])}>
        + Add
      </button>
    </div>
  );
}


function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const pick = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", gap: ".6rem", alignItems: "center", flexWrap: "wrap" }}>
      {value ? (
        <img
          src={value}
          alt="preview"
          style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
        />
      ) : null}
      <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} />
      <input
        placeholder="or paste an image URL"
        value={value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, minWidth: 180 }}
      />
      {value ? (
        <button className="btn btn-outline btn-small" onClick={() => onChange("")}>
          Remove
        </button>
      ) : null}
    </div>
  );
}

type QuickField = { key: string; label: string; area?: boolean; image?: boolean; initial?: string };

function QuickAdd({
  fields,
  submitLabel,
  onAdd,
}: {
  fields: QuickField[];
  submitLabel: string;
  onAdd: (values: Record<string, string>) => void;
}) {
  const initial = () =>
    Object.fromEntries(fields.map((f) => [f.key, f.initial ?? ""])) as Record<string, string>;
  const [values, setValues] = useState<Record<string, string>>(initial);

  const set = (key: string, v: string) => setValues((s) => ({ ...s, [key]: v }));

  return (
    <form
      className="field-grid"
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onAdd(values);
        setValues(initial());
      }}
    >
      {fields.map((f) =>
        f.image ? (
          <div className="field" key={f.key} style={{ gridColumn: "1 / -1" }}>
            <label>{f.label}</label>
            <ImagePicker value={values[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
          </div>
        ) : f.area ? (
          <Area key={f.key} label={f.label} value={values[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
        ) : (
          <Text key={f.key} label={f.label} value={values[f.key] ?? ""} onChange={(v) => set(f.key, v)} />
        ),
      )}
      <button className="btn btn-primary" type="submit" style={{ gridColumn: "1 / -1" }}>
        {submitLabel}
      </button>
    </form>
  );
}
