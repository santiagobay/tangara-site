import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use the Tangara website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return (
    <LegalPage title="Terms of use" updated="November 22, 2026">
      <p>
        These terms apply to your use of this website. By using the site, you agree to them. If you do not
        agree, please do not use the site.
      </p>

      <h2>About the content</h2>
      <p>
        Everything on this site, including text, design, code, animations, 3D work and images, belongs to
        Tangara unless stated otherwise, and is protected by copyright. You may view and share links to it, but
        you may not copy, reproduce or reuse it for commercial purposes without our written permission.
      </p>

      <h2>Direction studies and examples</h2>
      <p>
        Pieces labelled &quot;direction study&quot; or &quot;concept&quot; are illustrative work created by
        Tangara to show our approach. They are not client projects, and any brand names, figures or prices
        shown in them are fictional.
      </p>

      <h2>Quotes and services</h2>
      <p>
        Information on this site describes our services in general terms and is not an offer. Scope, price,
        timeline and payment terms for any project are set out in a written proposal or agreement, which takes
        precedence over anything on this site.
      </p>

      <h2>No warranty</h2>
      <p>
        We work to keep the site accurate and available, but it is provided &quot;as is&quot;. To the extent
        permitted by law, Tangara is not liable for any loss arising from your use of the site or from relying
        on its content.
      </p>

      <h2>Links to other sites</h2>
      <p>
        The site may link to websites we do not control. We are not responsible for their content or their
        privacy practices.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle personal information is explained in our <a href="/privacy">privacy policy</a>.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Canada that apply to them.</p>

      <h2>Contact</h2>
      <p>Questions about these terms can be sent to {mail}.</p>
    </LegalPage>
  );
}
