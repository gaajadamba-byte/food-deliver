"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { FoodCategory } from "@/lib/types";

const nomnomLinks = ["Home", "Contact us", "Delivery zone"];

export function Footer() {
  const [categories, setCategories] = useState<FoodCategory[]>([]);

  useEffect(() => {
    apiFetch<FoodCategory[]>("/food-category", { auth: false })
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return (
    <footer className="bg-[#1c1c1c] text-gray-300">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8432d]">
                <span className="text-lg font-black text-white leading-none">N</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-black tracking-tight text-white">NomNom</span>
                <span className="text-[10px] italic text-gray-400">thrift delivery</span>
              </div>
            </div>
          </div>

          {/* NomNom links */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              NomNom
            </h3>
            <ul className="space-y-2">
              {nomnomLinks.map((link) => (
                <li key={link}>
                  <Link
                    href={link === "Home" ? "/" : "#"}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu links — real food categories */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              Menu
            </h3>
            <div className="grid grid-cols-2 gap-x-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="mb-2 block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {category.categoryName}
                </Link>
              ))}
            </div>
          </div>

          {/* Follow us */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              Follow us
            </h3>
            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 hover:bg-[#e8432d] hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 hover:bg-[#e8432d] hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row">
          <span>Copyright 2024 &copy; NomNom LLC</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms and conditions</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
