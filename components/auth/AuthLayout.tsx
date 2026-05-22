import Image from "next/image";

const COURIER_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/ffd394fc69e59603366e3e625cbf195ffec61627?width=1712";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex items-center justify-center px-10 py-12">
        <div className="w-full max-w-[416px]">{children}</div>
      </div>
      <div className="hidden lg:block w-[56%] p-6">
        <div className="relative w-full h-full min-h-[640px] rounded-2xl overflow-hidden">
          <Image
            src={COURIER_IMAGE}
            alt="Delivery courier on bicycle"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
