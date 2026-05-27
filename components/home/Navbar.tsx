"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { totalCount, openDrawer } = useCart();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-black shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8432d]">
            <span className="text-lg font-black text-white leading-none">
              N
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black tracking-tight text-red-500">
              NomNom
            </span>
            <span className="text-[10px] italic text-gray-400">
              thrift delivery
            </span>
          </div>
        </Link>

        {/* Search bar */}
        <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 max-w-sm mx-auto">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Delivery address, find cuisine..."
            className="flex-1 bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400 min-w-0"
          />
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Search"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="relative">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-700 bg-gray-900 p-1 pr-3 transition-colors hover:bg-gray-800"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8432d] text-xs font-bold text-white">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                  <span className="hidden text-sm font-medium text-gray-200 sm:block">
                    {user?.email.split("@")[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
                    <Link
                      href="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} />
                      Миний захиалга
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Гарах
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8432d] text-white hover:bg-[#d03a26] transition-colors"
              >
                <User className="h-4 w-4" />
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={openDrawer}
            aria-label="Cart"
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#e8432d] text-[10px] font-bold text-white">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
