/**
 * Clerk UI aligned with Glowrora / Calm Authority tokens (see globals.css @theme).
 * Applied on ClerkProvider so SignIn, SignUp, and UserButton stay consistent.
 */
export const glowroraClerkAppearance = {
  variables: {
    colorPrimary: "#006c50",
    colorTextOnPrimary: "#ffffff",
    colorText: "#1b1c1a",
    colorTextSecondary: "#42474c",
    colorBackground: "#ffffff",
    colorInputBackground: "#eae8e5",
    colorInputText: "#1b1c1a",
    colorNeutral: "#73787d",
    colorDanger: "#ba1a1a",
    colorSuccess: "#006c50",
    colorShimmer: "#f5f3f0",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
    fontSize: "0.875rem",
    fontWeight: {
      normal: "400",
      medium: "500",
      bold: "600",
    },
  },
  elements: {
    rootBox: "mx-auto w-full font-sans",
    card: "rounded-2xl border-0 bg-surface-container-lowest shadow-[0_12px_40px_rgba(27,28,26,0.05)]",
    cardBox: "shadow-none",
    headerTitle: "font-headline text-xl font-bold tracking-tight text-primary-container",
    headerSubtitle: "text-on-surface-variant",
    socialButtonsIconButton: "border border-outline-variant/20 text-primary-container hover:bg-surface-container-low",
    socialButtonsBlockButton:
      "border border-outline-variant/25 bg-surface-container-low text-primary-container hover:bg-surface-container",
    socialButtonsBlockButtonText: "font-medium",
    socialButtonsBlockButtonArrow: "text-on-surface-variant",
    dividerLine: "bg-outline-variant/25",
    dividerText: "text-on-surface-variant text-xs uppercase tracking-wider",
    formFieldLabel: "text-on-surface font-medium",
    formFieldInput:
      "rounded-xl border-0 bg-surface-container-high text-on-surface placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/25",
    formFieldInputShowPasswordButton: "text-on-surface-variant hover:text-primary-container",
    formButtonPrimary:
      "rounded-xl bg-secondary font-semibold text-on-secondary shadow-sm transition hover:opacity-90",
    formButtonSecondary:
      "rounded-xl border border-outline-variant/25 bg-surface-container-low font-semibold text-primary-container hover:bg-surface-container",
    footer: "text-on-surface-variant",
    footerAction: "text-on-surface-variant",
    footerActionLink: "font-semibold text-secondary hover:opacity-90",
    formFieldErrorText: "text-on-error-container",
    formFieldSuccessText: "text-secondary",
    identityPreviewText: "text-primary-container",
    identityPreviewEditButton: "text-secondary",
    otpCodeFieldInputs: "gap-2",
    otpCodeFieldInput:
      "rounded-xl border-0 bg-surface-container-high text-on-surface focus:ring-2 focus:ring-primary/25",
    alertText: "text-sm",
    formResendCodeLink: "text-secondary font-semibold",
    alternativeMethodsBlockButton:
      "rounded-xl border border-outline-variant/25 bg-surface-container-low hover:bg-surface-container",
    userButtonPopoverCard:
      "rounded-2xl border-0 bg-surface-container-lowest shadow-[0_12px_40px_rgba(27,28,26,0.05)]",
    userButtonPopoverActionButton: "text-primary-container hover:bg-surface-container-low",
    userButtonPopoverActionButtonText: "font-medium",
    userButtonPopoverFooter: "border-t border-on-surface/5",
  },
} as const;
