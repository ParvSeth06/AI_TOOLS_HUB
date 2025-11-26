import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageLoading } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { GitBranch, Download, Copy, Check, RefreshCw } from "lucide-react";
import type { FlowchartInput, FlowchartResult } from "@shared/schema";

declare global {
  interface Window {
    mermaid: {
      initialize: (config: object) => void;
      render: (id: string, code: string) => Promise<{ svg: string }>;
    };
  }
}

export default function Flowchart() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  
  const [input, setInput] = useState<FlowchartInput>({
    processDescription: "",
    chartType: "flowchart",
  });

  const [result, setResult] = useState<FlowchartResult | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => {
      window.mermaid.initialize({ 
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
      });
      setMermaidLoaded(true);
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (result && mermaidLoaded && diagramRef.current) {
      renderDiagram();
    }
  }, [result, mermaidLoaded]);

  const renderDiagram = async () => {
    if (!result || !window.mermaid) return;
    try {
      const { svg } = await window.mermaid.render("flowchart-diagram", result.mermaidCode);
      setSvgContent(svg);
    } catch (error) {
      console.error("Mermaid render error:", error);
      toast({
        title: "Render Error",
        description: "Failed to render the flowchart. The code may have syntax issues.",
        variant: "destructive",
      });
    }
  };

  const flowchartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/flowchart", input);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate flowchart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!input.processDescription.trim()) {
      toast({
        title: "Missing Description",
        description: "Please describe the process you want to visualize.",
        variant: "destructive",
      });
      return;
    }
    flowchartMutation.mutate();
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Mermaid code copied to clipboard.",
    });
  };

  const handleDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flowchart.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Flowchart saved as SVG file.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg">
          <GitBranch className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Flowchart Generator</h1>
          <p className="text-muted-foreground">Convert process descriptions into visual diagrams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Process</CardTitle>
            <CardDescription>
              Explain the workflow, steps, or logic you want to visualize
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="process">Process Description</Label>
              <Textarea
                id="process"
                placeholder="Describe your process step by step. For example:
                
1. User visits website
2. User clicks login button
3. If user has account, show login form
4. If not, redirect to signup
5. After login, show dashboard..."
                value={input.processDescription}
                onChange={(e) => setInput({ ...input, processDescription: e.target.value })}
                className="min-h-[250px]"
                data-testid="input-process"
              />
            </div>

            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select
                value={input.chartType}
                onValueChange={(value) => setInput({ ...input, chartType: value as "flowchart" | "sequence" | "mindmap" })}
              >
                <SelectTrigger data-testid="select-chart-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flowchart">Flowchart - Process flow with decisions</SelectItem>
                  <SelectItem value="sequence">Sequence - Step-by-step progression</SelectItem>
                  <SelectItem value="mindmap">Mindmap - Hierarchical structure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={flowchartMutation.isPending}
              data-testid="button-generate-flowchart"
            >
              {flowchartMutation.isPending ? "Generating..." : "Generate Flowchart"}
            </Button>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card className="flex flex-col min-h-[600px]">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <CardTitle>Flowchart Result</CardTitle>
                <CardDescription>
                  {result ? "Your generated diagram" : "Your flowchart will appear here"}
                </CardDescription>
              </div>
              {result && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2" data-testid="button-copy-code">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Code
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2" data-testid="button-download-svg">
                    <Download className="h-4 w-4" />
                    SVG
                  </Button>
                  <Button variant="outline" size="sm" onClick={renderDiagram} className="gap-2" data-testid="button-refresh-diagram">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {flowchartMutation.isPending ? (
              <PageLoading text="Generating flowchart..." />
            ) : result ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div 
                  ref={diagramRef}
                  className="flex-1 bg-white dark:bg-gray-900 rounded-lg border p-4 overflow-auto flex items-center justify-center"
                  data-testid="flowchart-diagram"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
                
                <div className="space-y-2">
                  <Label>Steps Identified</Label>
                  <div className="flex flex-wrap gap-2">
                    {result.steps.map((step, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                        data-testid={`step-${index}`}
                      >
                        {index + 1}. {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <GitBranch className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No Flowchart Yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Describe your process on the left and click "Generate Flowchart" to create a diagram
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
