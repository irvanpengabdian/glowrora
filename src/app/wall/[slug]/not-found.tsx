import Link from "next/link";

export default function WallNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-sm font-medium text-on-secondary-container">
        Wall of Love
      </p>
      <h1 className="mt-2 font-headline text-2xl font-bold text-primary-container">
        This wall is not available
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
        The link may be wrong, or the campaign may have been removed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-secondary hover:underline"
      >
        ← Back home
      </Link>
    </div>
  );
}
