import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 mt-24">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <span className="font-display text-lg font-semibold text-ink">
              InterviewPreview
            </span>
            <p className="mt-3 text-sm text-ink-secondary leading-relaxed max-w-sm">
              AI-powered mock interviews that prepare you for the real thing.
              Practice with honest feedback, not hollow encouragement.
            </p>
          </div>

          <div>
            <h4 className="label-tag mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/setup"
                  className="text-sm text-ink-secondary hover:text-ink transition-colors"
                >
                  Start Your First Interview
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-ink-secondary hover:text-ink transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-ink-secondary hover:text-ink transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-ink-secondary hover:text-ink transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="label-tag mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-ink-secondary hover:text-ink transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-ink-secondary hover:text-ink transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-ink-secondary hover:text-ink transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <p className="text-xs text-ink-secondary">
            &copy; {new Date().getFullYear()} InterviewPreview. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
