import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="w-full">
      <div className="relative h-150 w-full">
        <Image
          src="/hero.png"
          alt="Today's offer — Steak Society"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
