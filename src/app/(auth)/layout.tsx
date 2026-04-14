import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-surface px-4 py-12">
      <div className="mb-8 w-full max-w-md text-center">
        <Link
          href="/"
          className="font-headline text-xl font-bold tracking-tight text-primary-container"
        >
          Glowrora
        </Link>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
          Real Stories. Beautiful Glow
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
