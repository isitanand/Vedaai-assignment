"use client";

import { Bell, ChevronDown, ArrowLeft, Pencil, Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HomeIcon } from "@/components/brand/CustomIcons";

const DEFAULT_NAME = "Elon Musk";
const STORAGE_KEY = "veda_user_name";

function EditableUserName() {
  const [name, setName] = useState(DEFAULT_NAME);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { setName(stored); setDraft(stored); }
  }, []);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    const trimmed = draft.trim() || DEFAULT_NAME;
    setName(trimmed);
    setDraft(trimmed);
    localStorage.setItem(STORAGE_KEY, trimmed);
    setEditing(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") { setDraft(name); setEditing(false); }
  }

  const avatarSeed = encodeURIComponent(name.replace(/\s+/g, ""));

  return (
    <div
      className="flex items-center gap-2 hover:bg-muted/50 p-1 pr-3 rounded-full transition-colors cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-border/50 bg-gray-50 shrink-0">
        <img
          src="/avatar.png"
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            const avatarSeed = encodeURIComponent(name.replace(/\s+/g, ""));
            e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;
          }}
        />
      </div>

      {editing ? (
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={onKeyDown}
            className="text-sm font-medium bg-transparent border-b border-foreground/40 outline-none w-28 leading-tight"
          />
          <button onClick={commit} className="text-muted-foreground hover:text-foreground transition-colors">
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5" onClick={() => { setEditing(true); setDraft(name); }}>
          <span className="text-sm font-medium">{name}</span>
          {hovered && <Pencil className="h-3 w-3 text-muted-foreground" />}
        </div>
      )}

      {!editing && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  let title = "Home";
  if (pathname.startsWith("/assignments")) title = "Assignment";
  if (pathname.startsWith("/library")) title = "Library";
  if (pathname.startsWith("/toolkit")) title = "AI Toolkit";
  if (pathname.startsWith("/create")) title = "Create Assignment";

  const showBack = pathname !== "/";

  return (
    <div className="sticky top-0 z-20 hidden md:flex w-full items-center px-6 py-4">
      <div className="flex w-full items-center justify-between rounded-3xl bg-white px-5 py-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-border/40">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => router.back()} className="rounded-full p-1.5 hover:bg-muted text-muted-foreground transition-colors" aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <HomeIcon className="h-5 w-5 text-gray-400" />
            <span className="font-semibold text-gray-700 text-[14px]">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-gray-700 hover:text-gray-900 transition-colors animate-fade-in" aria-label="Notifications">
            <Bell className="h-4.5 w-4.5" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#FF5A1F] border-2 border-white" />
          </button>

          <EditableUserName />
        </div>
      </div>
    </div>
  );
}
