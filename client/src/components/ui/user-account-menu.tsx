"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

type User = {
  name: string | null;
  email: string | null;
  avatar: string | null;
};

function getInitials(name: string | null, email: string | null) {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

type UserAccountMenuProps = {
  user: User;
  onLogout: () => void | Promise<void>;
};

export function UserAccountMenu({ user, onLogout }: UserAccountMenuProps) {
  const displayName = user.name?.trim() || "Account";
  const initials = getInitials(user.name, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-2 outline-none transition",
            "hover:border-white/25 hover:bg-white/10",
            "focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            "data-[state=open]:border-green/40 data-[state=open]:bg-white/10"
          )}
          aria-label="Open account menu"
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-white/10">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="size-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xs font-semibold text-white/90">
                {initials}
              </span>
            )}
          </span>
          <span className="hidden max-w-[120px] truncate text-left text-sm font-medium text-white/90 sm:block">
            {displayName}
          </span>
          <ChevronDown className="size-4 shrink-0 text-white/50" aria-hidden />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className={cn(
            "z-[100] min-w-[min(100vw-2rem,300px)] rounded-xl border border-white/10 bg-zinc-950/98 p-1 text-white shadow-2xl shadow-black/60 backdrop-blur-xl",
            "data-[side=bottom]:origin-top-right data-[side=top]:origin-bottom-right"
          )}
        >
          <div className="flex gap-3 px-3 py-3">
            <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-white/10">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="size-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-sm font-semibold text-white/90">
                  {initials}
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{displayName}</p>
              {user.email ? (
                <p className="truncate text-xs text-white/55">{user.email}</p>
              ) : null}
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-green">
                Signed in
              </p>
            </div>
          </div>

          <DropdownMenuSeparator className="my-1 h-px bg-white/10" />

          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/90 outline-none",
                "hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10"
              )}
            >
              <UserRound className="size-4 text-white/60" aria-hidden />
              My profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 h-px bg-white/10" />

          <DropdownMenuItem
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-300 outline-none",
              "hover:bg-red-500/15 focus:bg-red-500/15 data-[highlighted]:bg-red-500/15"
            )}
            onSelect={(e) => {
              e.preventDefault();
              void onLogout();
            }}
          >
            <LogOut className="size-4" aria-hidden />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
