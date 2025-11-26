import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PageLoading } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PenTool, Youtube, Globe, Lightbulb, Copy, Check, Download } from "lucide-react";
import type { BlogWriterInput, BlogResult } from "@shared/schema";

export default function BlogWriter() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const [input, setInput] = useState<BlogWriterInput>({
    inputType: "topic",
    content: "",
    tone: "professional",
  });

  const [result, setResult] = useState<BlogResult | null>(null);

  const blogMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/blog-writer", input);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate blog. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!input.content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide content or topic for the blog.",
        variant: "destructive",
      });
      return;
    }
    blogMutation.mutate();
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Blog content copied to clipboard.",
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.fullContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Blog saved as Markdown file.",
    });
  };

  const inputTypeIcons = {
    youtube: <Youtube className="h-4 w-4" />,
    url: <Globe className="h-4 w-4" />,
    topic: <Lightbulb className="h-4 w-4" />,
  };

  const placeholders = {
    youtube: "Paste a YouTube video URL to convert into a blog post",
    url: "Paste a webpage URL to transform into a blog article",
    topic: "Enter a topic or idea for your blog post (e.g., 'Benefits of Remote Work')",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
          <PenTool className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Blog Writer</h1>
          <p className="text-muted-foreground">Transform content into polished blog articles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Input Source</CardTitle>
            <CardDescription>
              Choose your source type and provide the content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Source Type</Label>
              <RadioGroup
                value={input.inputType}
                onValueChange={(value) => setInput({ ...input, inputType: value as "youtube" | "url" | "topic" })}
                className="grid grid-cols-3 gap-4"
              >
                {(["youtube", "url", "topic"] as const).map((type) => (
                  <div key={type}>
                    <RadioGroupItem value={type} id={`blog-${type}`} className="peer sr-only" />
                    <Label
                      htmlFor={`blog-${type}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      data-testid={`radio-${type}`}
                    >
                      {inputTypeIcons[type]}
                      <span className="mt-2 text-sm font-medium capitalize">{type === "url" ? "Website" : type}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-content">
                {input.inputType === "youtube" ? "YouTube URL" : input.inputType === "url" ? "Website URL" : "Topic/Idea"}
              </Label>
              <Textarea
                id="blog-content"
                placeholder={placeholders[input.inputType]}
                value={input.content}
                onChange={(e) => setInput({ ...input, content: e.target.value })}
                className="min-h-[150px]"
                data-testid="input-content"
              />
            </div>

            <div className="space-y-2">
              <Label>Writing Tone</Label>
              <Select
                value={input.tone}
                onValueChange={(value) => setInput({ ...input, tone: value as "professional" | "casual" | "academic" })}
              >
                <SelectTrigger data-testid="select-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional - Business-appropriate</SelectItem>
                  <SelectItem value="casual">Casual - Friendly and conversational</SelectItem>
                  <SelectItem value="academic">Academic - Formal and research-oriented</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={blogMutation.isPending}
              data-testid="button-generate-blog"
            >
              {blogMutation.isPending ? "Writing..." : "Generate Blog Post"}
            </Button>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card className="flex flex-col h-[700px]">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <CardTitle>Blog Preview</CardTitle>
                <CardDescription>
                  {result ? "Your generated blog article" : "Your blog will appear here"}
                </CardDescription>
              </div>
              {result && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2" data-testid="button-copy-blog">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2" data-testid="button-download-blog">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            {blogMutation.isPending ? (
              <PageLoading text="Writing your blog post..." />
            ) : result ? (
              <ScrollArea className="h-full pr-4">
                <article className="prose prose-sm dark:prose-invert max-w-none">
                  <h1 className="text-2xl font-bold mb-4" data-testid="text-blog-title">{result.title}</h1>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6" data-testid="text-blog-intro">
                    {result.introduction}
                  </p>

                  <Separator className="my-6" />

                  {result.sections.map((section, index) => (
                    <div key={index} className="mb-6" data-testid={`section-${index}`}>
                      <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  ))}

                  <Separator className="my-6" />

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-2">Conclusion</h2>
                    <p className="text-muted-foreground leading-relaxed" data-testid="text-blog-conclusion">
                      {result.conclusion}
                    </p>
                  </div>
                </article>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <PenTool className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No Blog Yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter a topic or URL on the left and click "Generate Blog Post" to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
