interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-[-0.6px] text-[#09090B] leading-8">
        {title}
      </h1>
      <p className="text-base font-normal text-[#71717A] leading-6">{subtitle}</p>
    </div>
  );
}
