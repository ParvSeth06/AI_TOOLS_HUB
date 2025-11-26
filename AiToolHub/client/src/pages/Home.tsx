import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ui/tool-card";
import { Link } from "wouter";
import {
  MessageSquare,
  FileText,
  PenTool,
  GitBranch,
  GraduationCap,
  Database,
  Zap,
  Shield,
  Download,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    title: "PersonaFlow",
    description: "Create custom AI characters and chat with them. Define personality, background, and communication style for consistent interactions.",
    icon: MessageSquare,
    href: "/persona-flow",
    gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    title: "AI Summarizer",
    description: "Extract concise summaries from YouTube videos, websites, or raw text. Get key points instantly with adjustable detail levels.",
    icon: FileText,
    href: "/summarizer",
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  {
    title: "Blog Writer",
    description: "Transform YouTube videos or webpages into fully formatted blog articles with introduction, sections, and conclusion.",
    icon: PenTool,
    href: "/blog-writer",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  {
    title: "Flowchart Generator",
    description: "Convert process descriptions into visual flowcharts automatically. Download and use in presentations or documentation.",
    icon: GitBranch,
    href: "/flowchart",
    gradient: "bg-gradient-to-br from-orange-500 to-amber-600",
  },
  {
    title: "Course Generator",
    description: "Create complete learning roadmaps for any topic. Get structured modules, resources, and a clear path to mastery.",
    icon: GraduationCap,
    href: "/course-generator",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    title: "Database Speaks",
    description: "Ask natural language questions about your data and get SQL queries automatically. No SQL knowledge required.",
    icon: Database,
    href: "#",
    gradient: "bg-gradient-to-br from-slate-500 to-gray-600",
    comingSoon: true,
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get AI-powered responses in seconds, not minutes. Our optimized infrastructure ensures lightning-fast processing.",
  },
  {
    icon: Shield,
    title: "No Setup Required",
    description: "Start using any tool immediately. No accounts, no configuration - just pure productivity from the first click.",
  },
  {
    icon: Download,
    title: "Download & Export",
    description: "Export your generated content in multiple formats. Flowcharts, courses, and articles ready for immediate use.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" data-testid="text-hero-title">
              AI-Powered Tools for{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Maximum Productivity
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto" data-testid="text-hero-description">
              Create AI personas, summarize content, write blogs, generate flowcharts, 
              and build courses - all with the power of artificial intelligence.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/persona-flow">
                <Button size="lg" className="gap-2 px-8" data-testid="button-hero-explore">
                  Explore Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/summarizer">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-hero-try-summarizer">
                  Try Summarizer Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-20 md:py-28" id="tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl" data-testid="text-tools-title">
              Powerful AI Tools
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Choose from our suite of AI-powered tools designed to help you work smarter, not harder.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              Why Choose AI Tools Hub?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Built for speed, simplicity, and power. Get more done with less effort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to Boost Your Productivity?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Start using our AI tools today and experience the future of work.
            </p>
            <div className="mt-8">
              <Link href="/persona-flow">
                <Button size="lg" className="gap-2 px-8" data-testid="button-cta-start">
                  Get Started Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
