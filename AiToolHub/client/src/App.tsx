import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import PersonaFlow from "@/pages/PersonaFlow";
import Summarizer from "@/pages/Summarizer";
import BlogWriter from "@/pages/BlogWriter";
import Flowchart from "@/pages/Flowchart";
import CourseGenerator from "@/pages/CourseGenerator";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/persona-flow" component={PersonaFlow} />
      <Route path="/summarizer" component={Summarizer} />
      <Route path="/blog-writer" component={BlogWriter} />
      <Route path="/flowchart" component={Flowchart} />
      <Route path="/course-generator" component={CourseGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
