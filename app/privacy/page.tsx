import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Tangara collects, uses and protects personal information, in line with Canadian privacy law.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return (
    <LegalPage title="Privacy policy" updated="November 22, 2026">
      <p>
        Tangara (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what personal
        information we collect through this website, why we collect it, and the choices you have. We handle
        personal information in line with Canada&apos;s{" "}
        <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable
        provincial privacy laws.
      </p>

      <h2>What we collect</h2>
      <p>We only collect what you choose to send us through the contact form or by email:</p>
      <ul>
        <li>your name and email address;</li>
        <li>your business or company name, if you provide it;</li>
        <li>the service you are interested in and the details you write about your project.</li>
      </ul>
      <p>
        We do not use advertising trackers or analytics cookies. The site stores one preference in your browser
        (whether interface sound is on or off). It never leaves your device and you can clear it at any time.
      </p>

      <h2>Why we collect it</h2>
      <p>
        We use your information only to reply to your enquiry, prepare a proposal or quote, and, if we work
        together, to deliver and support your project. We do not sell, rent or trade personal information.
      </p>

      <h2>Consent</h2>
      <p>
        By sending us a message, you consent to us using your information for the purposes above. We will not
        add you to a mailing list or send you promotional emails without your express consent, as required by
        Canada&apos;s Anti-Spam Legislation (CASL). You can withdraw your consent at any time by emailing {mail}.
      </p>

      <h2>Service providers</h2>
      <p>
        We rely on a small number of trusted providers to run this website and receive your messages: Vercel
        (website hosting), Resend (delivery of contact-form emails) and Google (email inbox). These providers
        may store or process information outside Canada, including in the United States, where it may be
        accessible to authorities under local law. We only use providers that protect information to a
        standard comparable to ours.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry messages for up to 24 months after our last contact, unless we start a project
        together, in which case we keep project records for as long as needed to provide the service and meet
        legal and accounting obligations. After that, we delete them.
      </p>

      <h2>How we protect it</h2>
      <p>
        Information sent through this site travels over an encrypted (HTTPS) connection. Access to enquiries is
        limited to the Tangara team, and accounts are protected with strong passwords and two-factor
        authentication where available.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us at any time what personal information we hold about you, ask us to correct it, or ask us
        to delete it. Email {mail} and we will reply within 30 days. If you are not satisfied with our answer,
        you can contact the{" "}
        <a href="https://www.priv.gc.ca/" target="_blank" rel="noopener noreferrer">
          Office of the Privacy Commissioner of Canada
        </a>
        .
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or about your information can be sent to our privacy contact at {mail}.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy as the studio grows. The date at the top always shows the latest version.
      </p>
    </LegalPage>
  );
}
