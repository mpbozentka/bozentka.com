"use client";

import Script from "next/script";

interface NewsletterSignupProps {
  /** Beehiiv form ID from subscribe form embed code (iframe src). */
  formId: string;
  /** Optional class for the wrapper. */
  className?: string;
}

export function NewsletterSignup({ formId, className = "" }: NewsletterSignupProps) {
  if (!formId?.trim()) {
    return null;
  }

  const embedUrl = `https://subscribe-forms.beehiiv.com/${formId.trim()}`;

  return (
    <div className={className}>
      <Script
        src="https://subscribe-forms.beehiiv.com/embed.js"
        strategy="afterInteractive"
      />
      <iframe
        src={embedUrl}
        className="beehiiv-embed w-full min-h-[200px] border-0 rounded-xl bg-transparent"
        data-test-id="beehiiv-embed"
        title="Subscribe to newsletter"
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
}
