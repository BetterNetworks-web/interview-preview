"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function PricingPage() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
    }
  };

  return (
    <>
      <Header />

      <div className="section-container py-24">
        <div className="text-center mb-16 animate-fade-in">
          <p className="label-tag mb-4">Pricing</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-lg text-ink-secondary max-w-lg mx-auto">
            Start free. Upgrade when you&apos;re serious about landing the role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <Card padding="lg">
            <p className="label-tag mb-2">Free</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-5xl font-semibold">$0</span>
              <span className="text-sm text-ink-secondary">/month</span>
            </div>
            <p className="text-sm text-ink-secondary mb-8">
              Everything you need to get started
            </p>

            <ul className="space-y-4 mb-8">
              {[
                {
                  feature: "3 interviews per month",
                  description: "Enough to build a habit",
                },
                {
                  feature: "Full scorecard after each",
                  description: "All four dimensions scored and explained",
                },
                {
                  feature: "All difficulty levels",
                  description:
                    "From Comfortable to Brutal — nothing is locked",
                },
                {
                  feature: "No CV personalisation",
                  description: "Questions are role-based, not CV-tailored",
                },
              ].map((item, i) => (
                <li key={i}>
                  <div className="flex items-start gap-3">
                    <span className="text-accent mt-0.5 text-sm">
                      &#10003;
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {item.feature}
                      </p>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/setup" className="block">
              <Button variant="secondary" className="w-full">
                Start Free
              </Button>
            </Link>
          </Card>

          {/* Pro */}
          <Card padding="lg" className="border-accent/30 relative">
            <div className="absolute -top-3 right-6">
              <span className="bg-accent text-parchment text-xs font-mono px-3 py-1 rounded-full">
                POPULAR
              </span>
            </div>
            <p className="label-tag mb-2">Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-5xl font-semibold">
                $9.99
              </span>
              <span className="text-sm text-ink-secondary">/month</span>
            </div>
            <p className="text-sm text-ink-secondary mb-8">
              For serious interview preparation
            </p>

            <ul className="space-y-4 mb-8">
              {[
                {
                  feature: "Unlimited interviews",
                  description: "Practice as much as you want, no limits",
                },
                {
                  feature: "CV-personalised questions",
                  description:
                    "Questions tailored to your specific experience and gaps",
                },
                {
                  feature: "Full score history & progress tracking",
                  description: "See every past scorecard and your score trend",
                },
                {
                  feature: "Streak tracking",
                  description:
                    "Build a daily practice habit with streak counting",
                },
                {
                  feature: "Priority question depth",
                  description:
                    "More follow-up probing on Hard and Brutal difficulties",
                },
              ].map((item, i) => (
                <li key={i}>
                  <div className="flex items-start gap-3">
                    <span className="text-accent mt-0.5 text-sm">
                      &#10003;
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {item.feature}
                      </p>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Button className="w-full" onClick={handleCheckout}>
              Get Pro — $9.99/mo
            </Button>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-24">
          <h2 className="font-display text-2xl font-semibold text-ink mb-8 text-center">
            Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel your Pro subscription at any time and you'll keep access until the end of your billing period.",
              },
              {
                q: "What happens to my data if I downgrade?",
                a: "Your scorecards are always saved. On the free plan, you'll only see the last 3 in your dashboard, but nothing is deleted.",
              },
              {
                q: "How are the questions generated?",
                a: "We use Claude AI to generate questions tailored to your specific role, job description, and experience. No two interviews are the same.",
              },
              {
                q: "Is the scoring really honest?",
                a: "Yes. An average answer scores 55-65. We don't inflate scores to make you feel good — we give you the truth so you can actually improve.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-border pb-6">
                <p className="font-body font-medium text-ink mb-2">{faq.q}</p>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
