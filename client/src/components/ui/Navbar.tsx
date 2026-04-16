"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { serverUrl } from "@/helpers/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signOutSuccess } from "@/store/features/auth/authSlice";
import { UserAccountMenu } from "@/components/ui/user-account-menu";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (pathname?.startsWith("/builder") || pathname?.startsWith("/sites/")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // still clear client state if server fails
    }
    dispatch(signOutSuccess());
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold text-white"
        >
          <span
            className="inline-flex size-2 rounded-full bg-green shadow-[0_0_12px_var(--color-green)]"
            aria-hidden
          />
          <span className="bg-linear-to-r from-green via-[#c8ef2a] to-green bg-clip-text text-base font-semibold tracking-wide text-transparent">
            WebGenie AI
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link className="transition hover:text-white" href="/">
            Home
          </Link>
          {isAuthenticated ? (
            <Link
              className="transition hover:text-white"
              href="/generate"
            >
              Generate
            </Link>
          ) : null}
          <Link className="transition hover:text-white" href="/about">
            About
          </Link>
          <Link className="transition hover:text-white" href="/contact">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user?.email ? (
            <>
            <div className="text-sm text-white/70 border border-green/20 rounded-full px-3 py-1">
              <p> <span className="text-green">Credits:</span> {user.credits}</p>
            </div> 

            <UserAccountMenu user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link
                className="text-sm text-white/70 transition hover:text-white"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-full bg-green px-4 py-2 text-sm font-semibold text-black transition hover:brightness-95"
                href="/login"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;