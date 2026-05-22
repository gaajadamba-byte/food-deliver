const BANNER_TEXT = "Fresh fast delivered \u00b7 ";

export function ScrollingBanner() {
  const repeated = BANNER_TEXT.repeat(10);

  return (
    <div className="overflow-hidden bg-[#1c1c1c] py-4">
      <div className="flex whitespace-nowrap animate-marquee-banner">
        <span className="text-base font-bold uppercase tracking-widest text-[#e8432d] pr-8">
          {repeated}
        </span>
        <span
          className="text-base font-bold uppercase tracking-widest text-[#e8432d] pr-8"
          aria-hidden
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}
