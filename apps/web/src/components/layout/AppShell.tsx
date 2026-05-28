"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  Sparkles,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { TopNav } from "@/components/layout/TopNav";
import {
  HomeIcon,
  MyGroupsIcon,
  AssignmentsIcon,
  ToolkitIcon,
  LibraryIcon,
} from "@/components/brand/CustomIcons";
import { useEffect, useState } from "react";
import type { ReactNode, ComponentType } from "react";

function MobileUserAvatar() {
  const [userName, setUserName] = useState("Elon Musk");

  useEffect(() => {
    const stored = localStorage.getItem("veda_user_name");
    if (stored) setUserName(stored);

    const interval = setInterval(() => {
      const storedNow = localStorage.getItem("veda_user_name");
      if (storedNow && storedNow !== userName) setUserName(storedNow);
    }, 1000);
    return () => clearInterval(interval);
  }, [userName]);

  return (
    <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-border/50 bg-gray-50 shrink-0">
      <img
        src="/avatar.png"
        alt={userName}
        className="h-full w-full object-cover"
        onError={(e) => {
          const avatarSeed = encodeURIComponent(userName.replace(/\s+/g, ""));
          e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;
        }}
      />
    </div>
  );
}

function SchoolCard() {
  const [name, setName] = useState("Delhi Public School");
  const [city, setCity] = useState("Bokaro Steel City");

  useEffect(() => {
    const sn = localStorage.getItem("veda_school_name");
    const sc = localStorage.getItem("veda_school_city");
    if (sn) setName(sn);
    if (sc) setCity(sc);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted/70 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm ring-1 ring-border bg-white">
        <img
          src="/school-logo.png"
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{city}</p>
      </div>
    </div>
  );
}

type NavItem = { href: string; label: string; icon: ComponentType<any>; badge?: string };

const SIDEBAR_NAV: NavItem[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/groups", label: "My Groups", icon: MyGroupsIcon },
  { href: "/assignments", label: "Assignments", icon: AssignmentsIcon },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: ToolkitIcon },
  { href: "/library", label: "My Library", icon: LibraryIcon },
];

const MOBILE_NAV = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/assignments", label: "Assignments", icon: AssignmentsIcon },
  { href: "/library", label: "Library", icon: LibraryIcon },
  { href: "/toolkit", label: "AI Toolkit", icon: ToolkitIcon },
];


function useActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

export function AppShell({ children }: { children: ReactNode }) {
  const isActive = useActive();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {}
      <aside className="no-print sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col bg-white px-4 py-6 shadow-[1px_0_0_0_hsl(var(--border))] md:flex z-30">
        <Link href="/" className="mb-6 px-2">
          <Logo />
        </Link>

        <Link
          href="/create"
          className="pill-gradient-ring mb-8 flex h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold"
        >
          <Sparkles className="h-4 w-4" /> Create Assignment
        </Link>

        <nav className="flex flex-col gap-1">
          {SIDEBAR_NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-xs font-semibold text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <Settings className="h-[18px] w-[18px]" /> Settings
          </Link>
          <SchoolCard />
        </div>
      </aside>

      <div className="flex flex-1 flex-col relative w-full overflow-x-hidden">
        {}
        <header className="no-print sticky top-0 z-20 bg-[#F9FAFB]/95 backdrop-blur-md px-4 pt-4 pb-2 md:hidden">
          <div className="flex h-16 items-center justify-between rounded-[28px] bg-white pl-4 pr-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-border/30">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark className="h-9 w-9 rounded-xl" />
              <span className="font-semibold text-gray-900 text-[18px] tracking-tight ml-0.5">VedaAI</span>
            </Link>
            <div className="flex items-center gap-3.5">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-gray-700 hover:text-gray-900 transition-colors" aria-label="Notifications">
                <Bell className="h-5 w-5" strokeWidth={1.8} />
                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#FF5A1F] border-2 border-white" />
              </button>
              <MobileUserAvatar />
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-900 transition-colors p-1" aria-label="Toggle menu">
                <Menu className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>
          </div>
        </header>

        {}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setMenuOpen(false)}>
            <div className="absolute right-4 top-20 w-64 rounded-3xl bg-white p-5 shadow-2xl border border-border animate-slide-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-1">Navigation</p>
                {SIDEBAR_NAV.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    <span>{label}</span>
                  </Link>
                ))}
                <div className="border-t border-border/60 my-2 pt-2" />
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60"
                >
                  <Settings className="h-[18px] w-[18px]" /> Settings
                </Link>
                <div className="mt-2">
                  <SchoolCard />
                </div>
              </div>
            </div>
          </div>
        )}

        <TopNav />

        <main className="flex-1 pb-24 md:pb-0">{children}</main>

        {}
        <nav className="no-print fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md items-center justify-around rounded-t-3xl bg-primary px-2 py-3 text-primary-foreground md:hidden">
          {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-1">
                <Icon className={cn("h-5 w-5", active ? "text-white" : "text-white/55")} />
                <span className={cn("text-[10px]", active ? "font-semibold text-white" : "text-white/55")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
