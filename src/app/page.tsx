import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="section-container pt-24 pb-20">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <p className="label-tag mb-6">AI-Powered Mock Interviews</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-ink leading-[1.1] tracking-tight">
            Practice until the real thing feels easy.
          </h1>
          <p className="mt-6 text-lg text-ink-secondary max-w-xl mx-auto leading-relaxed">
            Real interview questions tailored to your role. Honest scoring
            across four dimensions. Detailed feedback that actually helps you
            improve.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Link href="/setup">
              <Button size="lg">Start Your First Interview</Button>
            </Link>
          </div>
        </div>

        {/* Interview Preview Mockup */}
        <div className="mt-20 max-w-2xl mx-auto">
          <Card padding="lg" className="relative">
            <div className="flex items-center justify-between mb-6">
              <span className="label-tag">Question 3 of 8</span>
              <span className="label-tag">Senior Product Manager</span>
            </div>
            <h3 className="font-display text-xl md:text-2xl text-ink leading-relaxed mb-6">
              &ldquo;Tell me about a time you had to kill a feature that your
              team had spent months building. How did you make that decision and
              communicate it?&rdquo;
            </h3>
            <div className="bg-parchment rounded-btn border border-border p-4 h-24 flex items-start">
              <span className="text-ink-secondary/40 text-sm">
                Type your answer here...
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="bg-ink text-parchment px-5 py-2.5 rounded-btn text-sm font-medium">
                Submit Answer
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="section-container py-24">
        <div className="text-center mb-16">
          <p className="label-tag mb-4">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            Three steps to interview confidence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card padding="lg">
            <div className="font-mono text-xs text-accent mb-4">01</div>
            <h3 className="font-display text-xl font-semibold mb-3">
              Personalised Questions
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Tell us your role, paste the job description, and share your
              experience. Our AI generates questions tailored specifically to
              your situation — not generic prompts from a textbook.
            </p>
          </Card>

          <Card padding="lg">
            <div className="font-mono text-xs text-accent mb-4">02</div>
            <h3 className="font-display text-xl font-semibold mb-3">
              Honest Scoring
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Every answer is evaluated across four dimensions: evidence,
              pressure handling, self-awareness, and strategic thinking. No
              flattery — an average answer scores 55-65, not 80.
            </p>
          </Card>

          <Card padding="lg">
            <div className="font-mono text-xs text-accent mb-4">03</div>
            <h3 className="font-display text-xl font-semibold mb-3">
              Choose Your Difficulty
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed">
              From supportive practice to brutal interrogation. Higher
              difficulties include follow-up questions, pushback on vague
              answers, and no concessions for deflections.
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="dark-section py-24">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-4">
              What People Say
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Honest practice, real results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The brutal difficulty mode caught every vague answer I tried to sneak past. By the time I walked into my real interview, nothing surprised me.",
                name: "Sarah K.",
                role: "Product Manager at a FAANG company",
              },
              {
                quote:
                  "I was scoring 52 on my first attempt. Three weeks later I hit 84. The specific feedback on each answer is what made the difference — not generic tips.",
                name: "James M.",
                role: "Senior Software Engineer",
              },
              {
                quote:
                  "The 'one thing to fix' section after each session gave me a clear focus for improvement. It's like having a brutally honest friend who interviews for a living.",
                name: "Priya T.",
                role: "Management Consultant",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="border border-parchment/10 rounded-card p-6"
              >
                <p className="text-parchment/90 text-sm leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="text-parchment font-medium text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-parchment/50 text-xs mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section-container py-24">
        <div className="text-center mb-16">
          <p className="label-tag mb-4">Pricing</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            Simple, honest pricing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card padding="lg">
            <p className="label-tag mb-2">Free</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-4xl font-semibold">$0</span>
              <span className="text-sm text-ink-secondary">/month</span>
            </div>
            <p className="text-sm text-ink-secondary mb-6">
              Get started with the essentials
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "3 interviews per month",
                "Full scorecard after each",
                "All difficulty levels",
              ].map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-ink-secondary"
                >
                  <span className="text-accent mt-0.5">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/setup" className="block">
              <Button variant="secondary" className="w-full">
                Start Free
              </Button>
            </Link>
          </Card>

          <Card padding="lg" className="border-accent/30 relative">
            <div className="absolute -top-3 right-6">
              <span className="bg-accent text-parchment text-xs font-mono px-3 py-1 rounded-full">
                POPULAR
              </span>
            </div>
            <p className="label-tag mb-2">Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-4xl font-semibold">
                $9.99
              </span>
              <span className="text-sm text-ink-secondary">/month</span>
            </div>
            <p className="text-sm text-ink-secondary mb-6">
              For serious interview preparation
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited interviews",
                "CV-personalised questions",
                "Full score history & progress",
                "Score trend over time",
                "Priority question depth",
              ].map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-ink-secondary"
                >
                  <span className="text-accent mt-0.5">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block">
              <Button className="w-full">Get Pro</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container pb-24">
        <div className="dark-section rounded-card p-12 md:p-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Your next interview is coming.
          </h2>
          <p className="text-parchment/70 max-w-md mx-auto mb-8">
            Stop rehearsing answers in your head. Practice them properly and
            know exactly where you stand.
          </p>
          <Link href="/setup">
            <Button variant="accent" size="lg">
              Start Your First Interview
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
