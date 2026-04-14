"use client";

import { useRouter } from "next/navigation";
import { type ComponentProps, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<"button"> & {
  pendingLabel?: string;
  /** Call `router.refresh()` when a submit finishes (pairs with `revalidatePath` on the server). */
  refreshAfterSubmit?: boolean;
};

export function PendingButton({
  children,
  pendingLabel,
  disabled,
  refreshAfterSubmit,
  ...props
}: Props) {
  const { pending } = useFormStatus();
  const router = useRouter();
  const wasPending = useRef(false);

  useEffect(() => {
    if (refreshAfterSubmit && wasPending.current && !pending) {
      router.refresh();
    }
    wasPending.current = pending;
  }, [pending, refreshAfterSubmit, router]);

  return (
    <button
      type="submit"
      disabled={disabled ?? pending}
      {...props}
    >
      {pending ? (pendingLabel ?? "…") : children}
    </button>
  );
}
