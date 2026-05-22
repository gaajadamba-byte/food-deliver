"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
}

export function BackButton({ href, onClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back"
      className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[#E4E4E7] bg-white text-[#18181B] transition-colors hover:bg-gray-50"
    >
      <ChevronLeft className="size-4" />
    </button>
  );
}
