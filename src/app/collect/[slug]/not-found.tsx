import Link from "next/link";

export default function CollectNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-sm font-medium text-on-error-container">
        Link not found
      </p>
      <h1 className="mt-2 font-headline text-2xl font-bold text-primary-container">
        This collection does not exist
      </h1>
      <p className="mt-4 text-sm text-on-surface-variant">
        The link may be wrong, or the campaign may have been removed. Ask the
        person who sent you the link for an updated URL.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-secondary hover:underline"
      >
        Go to Glowrora home
      </Link>
    </div>
  );
}
