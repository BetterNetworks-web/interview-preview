"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Header />

      <div className="section-container py-24">
        <div className="text-center mb-16 animate-fade-in">
          <p className="label-tag mb-4">Contact</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-ink-secondary max-w-lg mx-auto">
            Have a question, suggestion, or just want to say hello? We&apos;d
            love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card padding="lg">
              {status === "sent" ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-accent text-xl">&#10003;</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink mb-2">
                    Message sent
                  </h3>
                  <p className="text-sm text-ink-secondary">
                    Thanks for reaching out. We&apos;ll get back to you as soon
                    as we can.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Textarea
                    label="Message"
                    placeholder="How can we help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />

                  {status === "error" && (
                    <p className="text-sm text-red-600">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <Button
                    type="submit"
                    loading={status === "sending"}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card padding="lg">
              <h3 className="font-display text-lg font-semibold text-ink mb-3">
                Email us directly
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed mb-3">
                Prefer email? You can reach us at:
              </p>
              <a
                href="mailto:isaac@betternetworks.com.au"
                className="text-sm text-accent hover:text-accent/80 transition-colors break-all"
              >
                isaac@betternetworks.com.au
              </a>
            </Card>

            <Card padding="lg">
              <h3 className="font-display text-lg font-semibold text-ink mb-3">
                Response time
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                We typically respond within 1&ndash;2 business days. For urgent
                issues related to your account or billing, please mention it in
                your message.
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="font-display text-lg font-semibold text-ink mb-3">
                Common questions
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Before reaching out, you might find your answer on our{" "}
                <a
                  href="/pricing"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  pricing page
                </a>
                .
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
