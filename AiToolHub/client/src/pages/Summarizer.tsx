import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Youtube, Globe, AlignLeft, List, Copy, Check } from "lucide-react";
import type { SummarizerInput, SummaryResult } from "@shared/schema";

export default function Summarizer() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const [input, setInput] = useState<SummarizerInput>({
    inputType: "text",
    content: "",
    detailLevel: "standard",
  });

  const [result, setResult] = useState<SummaryResult | null>(null);

  const summarizeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/summarizer", input);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!input.content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide content to summarize.",
        variant: "destructive",
      });
      return;
    }
    summarizeMutation.mutate();
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `${result.summary}\n\nKey Points:\n${result.keyPoints.map(p => `• ${p}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard.",
    });
  };

  const inputTypeIcons = {
    youtube: <Youtube className="h-4 w-4" />,
    url: <Globe className="h-4 w-4" />,
    text: <AlignLeft className="h-4 w-4" />,
  };

  const placeholders = {
    youtube: "Paste a YouTube video URL (e.g., https://youtube.com/watch?v=...)",
    url: "Paste a webpage URL (e.g., https://example.com/article)",
    text: "Paste or type the text you want to summarize...",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">AI Summarizer</h1>
          <p className="text-muted-foreground">Extract concise summaries from any content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Input Content</CardTitle>
            <CardDescription>
              Choose your content type and provide the source
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Content Type</Label>
              <RadioGroup
                value={input.inputType}
                onValueChange={(value) => setInput({ ...input, inputType: value as "youtube" | "url" | "text" })}
                className="grid grid-cols-3 gap-4"
              >
                {(["youtube", "url", "text"] as const).map((type) => (
                  <div key={type}>
                    <RadioGroupItem value={type} id={type} className="peer sr-only" />
                    <Label
                      htmlFor={type}
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
              <Label htmlFor="content">
                {input.inputType === "youtube" ? "YouTube URL" : input.inputType === "url" ? "Website URL" : "Text Content"}
              </Label>
              <Textarea
                id="content"
                placeholder={placeholders[input.inputType]}
                value={input.content}
                onChange={(e) => setInput({ ...input, content: e.target.value })}
                className="min-h-[200px]"
                data-testid="input-content"
              />
            </div>

            <div className="space-y-2">
              <Label>Detail Level</Label>
              <Select
                value={input.detailLevel}
                onValueChange={(value) => setInput({ ...input, detailLevel: value as "brief" | "standard" | "detailed" })}
              >
                <SelectTrigger data-testid="select-detail-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief - Key points only</SelectItem>
                  <SelectItem value="standard">Standard - Balanced summary</SelectItem>
                  <SelectItem value="detailed">Detailed - Comprehensive overview</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={summarizeMutation.isPending}
              data-testid="button-summarize"
            >
              {summarizeMutation.isPending ? "Summarizing..." : "Generate Summary"}
            </Button>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  Summary Result
                </CardTitle>
                <CardDescription>
                  {result ? `${result.wordCount} words` : "Your summary will appear here"}
                </CardDescription>
              </div>
              {result && (
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2" data-testid="button-copy-summary">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {summarizeMutation.isPending ? (
              <PageLoading text="Generating summary..." />
            ) : result ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-summary">
                    {result.summary}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {result.keyPoints.map((point, index) => (
                      <li 
                        key={index} 
                        className="flex items-start gap-2"
                        data-testid={`text-keypoint-${index}`}
                      >
                        <Badge variant="secondary" className="mt-0.5 shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No Summary Yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter content on the left and click "Generate Summary" to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
