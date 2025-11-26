import { Link } from "wouter";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">AI Tools Hub</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Powerful AI-powered tools to boost your productivity. Create personas, 
              summarize content, write blogs, generate flowcharts, and build courses.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/persona-flow" className="hover-elevate rounded px-1 -mx-1">
                  PersonaFlow
                </Link>
              </li>
              <li>
                <Link href="/summarizer" className="hover-elevate rounded px-1 -mx-1">
                  AI Summarizer
                </Link>
              </li>
              <li>
                <Link href="/blog-writer" className="hover-elevate rounded px-1 -mx-1">
                  Blog Writer
                </Link>
              </li>
              <li>
                <Link href="/flowchart" className="hover-elevate rounded px-1 -mx-1">
                  Flowchart Generator
                </Link>
              </li>
              <li>
                <Link href="/course-generator" className="hover-elevate rounded px-1 -mx-1">
                  Course Generator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover-elevate rounded px-1 -mx-1 cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover-elevate rounded px-1 -mx-1 cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover-elevate rounded px-1 -mx-1 cursor-pointer">
                  Contact
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI Tools Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
