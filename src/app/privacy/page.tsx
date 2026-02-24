import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy - InterviewPreview",
  description:
    "Privacy policy for InterviewPreview. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <div className="section-container py-24">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <p className="label-tag mb-4">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-ink-secondary mb-12">
            Last updated: February 25, 2026
          </p>

          <div className="prose-custom space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                1. Introduction
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                InterviewPreview (&quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;) operates the interviewpreview.com website. This
                Privacy Policy explains how we collect, use, and protect your
                personal information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                2. Information We Collect
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed mb-3">
                We collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-ink-secondary leading-relaxed">
                <li>
                  <strong className="text-ink">Account information:</strong>{" "}
                  Email address and password when you create an account.
                </li>
                <li>
                  <strong className="text-ink">Interview data:</strong> Role
                  titles, job descriptions, CV summaries, and interview answers
                  you provide during mock interviews.
                </li>
                <li>
                  <strong className="text-ink">Payment information:</strong>{" "}
                  Billing details are processed securely by Stripe. We do not
                  store your credit card information on our servers.
                </li>
                <li>
                  <strong className="text-ink">Usage data:</strong> Basic
                  analytics such as pages visited and features used to help us
                  improve the service.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-sm text-ink-secondary leading-relaxed">
                <li>To provide and maintain our mock interview service.</li>
                <li>
                  To generate personalised interview questions and scorecards.
                </li>
                <li>To process payments and manage subscriptions.</li>
                <li>
                  To communicate with you about your account or respond to
                  enquiries.
                </li>
                <li>To improve and develop new features for our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                4. We Do Not Sell Your Data
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                We do not sell, rent, or trade your personal information to third
                parties. Your data is used solely to provide and improve our
                service. We will never monetise your personal data or share it
                with advertisers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                5. Third-Party Services
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed mb-3">
                We use the following third-party services to operate our
                platform:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-ink-secondary leading-relaxed">
                <li>
                  <strong className="text-ink">Supabase:</strong> Database
                  hosting and authentication.
                </li>
                <li>
                  <strong className="text-ink">Stripe:</strong> Payment
                  processing.
                </li>
                <li>
                  <strong className="text-ink">Anthropic:</strong> AI-powered
                  question generation and evaluation.
                </li>
                <li>
                  <strong className="text-ink">Resend:</strong> Transactional
                  email delivery.
                </li>
              </ul>
              <p className="text-sm text-ink-secondary leading-relaxed mt-3">
                Each of these services has their own privacy policy governing how
                they handle data.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                6. Data Security
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                We implement industry-standard security measures to protect your
                data. All data is transmitted over HTTPS and stored securely with
                row-level security policies. However, no method of transmission
                over the internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                7. Data Retention
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                We retain your data for as long as your account is active. If you
                delete your account, we will remove your personal data from our
                systems within 30 days, except where we are required by law to
                retain it.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                8. Your Rights
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-ink-secondary leading-relaxed">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data.</li>
                <li>
                  Withdraw consent for data processing where consent is the
                  basis.
                </li>
              </ul>
              <p className="text-sm text-ink-secondary leading-relaxed mt-3">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:isaac@betternetworks.com.au"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  isaac@betternetworks.com.au
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                9. Cookies
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                We use essential cookies required for authentication and session
                management. We do not use tracking cookies or third-party
                advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                10. Changes to This Policy
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by posting the updated
                policy on this page with a revised &quot;Last updated&quot;
                date.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                11. Contact Us
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:isaac@betternetworks.com.au"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  isaac@betternetworks.com.au
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
