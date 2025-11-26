import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageLoading } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  GraduationCap, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Video, 
  FileText, 
  Dumbbell,
  Clock,
  BarChart3,
  ExternalLink
} from "lucide-react";
import type { CourseInput, CourseResult, CourseModule } from "@shared/schema";

const resourceIcons = {
  video: Video,
  article: FileText,
  book: BookOpen,
  exercise: Dumbbell,
};

export default function CourseGenerator() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const [input, setInput] = useState<CourseInput>({
    topic: "",
    level: "beginner",
    duration: "1-month",
  });

  const [result, setResult] = useState<CourseResult | null>(null);

  const courseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/course-generator", input);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!input.topic.trim()) {
      toast({
        title: "Missing Topic",
        description: "Please enter a topic for your course.",
        variant: "destructive",
      });
      return;
    }
    courseMutation.mutate();
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = formatCourseAsText(result);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Course content copied to clipboard.",
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const text = formatCourseAsText(result);
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, "-").toLowerCase()}-course.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Course saved as Markdown file.",
    });
  };

  const formatCourseAsText = (course: CourseResult): string => {
    let text = `# ${course.title}\n\n`;
    text += `**Level:** ${course.level}\n`;
    text += `**Duration:** ${course.totalDuration}\n\n`;
    text += `## Description\n${course.description}\n\n`;
    text += `## Modules\n\n`;
    
    course.modules.forEach((module, index) => {
      text += `### Module ${index + 1}: ${module.title}\n`;
      text += `**Duration:** ${module.duration}\n\n`;
      text += `${module.description}\n\n`;
      text += `**Topics:**\n`;
      module.topics.forEach(topic => {
        text += `- ${topic}\n`;
      });
      text += `\n**Resources:**\n`;
      module.resources.forEach(resource => {
        text += `- [${resource.type}] ${resource.title}${resource.url ? ` - ${resource.url}` : ''}\n`;
      });
      text += `\n`;
    });
    
    return text;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Course Generator</h1>
          <p className="text-muted-foreground">Create complete learning roadmaps for any topic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Course Settings</CardTitle>
            <CardDescription>
              Define your learning goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Course Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Machine Learning, Web Development, Photography"
                value={input.topic}
                onChange={(e) => setInput({ ...input, topic: e.target.value })}
                data-testid="input-topic"
              />
            </div>

            <div className="space-y-2">
              <Label>Skill Level</Label>
              <Select
                value={input.level}
                onValueChange={(value) => setInput({ ...input, level: value as "beginner" | "intermediate" | "advanced" })}
              >
                <SelectTrigger data-testid="select-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - No prior knowledge</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                  <SelectItem value="advanced">Advanced - Deep expertise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course Duration</Label>
              <Select
                value={input.duration}
                onValueChange={(value) => setInput({ ...input, duration: value as "1-week" | "1-month" | "3-months" })}
              >
                <SelectTrigger data-testid="select-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">1 Week - Quick introduction</SelectItem>
                  <SelectItem value="1-month">1 Month - Comprehensive learning</SelectItem>
                  <SelectItem value="3-months">3 Months - In-depth mastery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={courseMutation.isPending}
              data-testid="button-generate-course"
            >
              {courseMutation.isPending ? "Generating..." : "Generate Course"}
            </Button>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card className="lg:col-span-2 flex flex-col min-h-[700px]">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <CardTitle>Course Roadmap</CardTitle>
                <CardDescription>
                  {result ? result.title : "Your learning path will appear here"}
                </CardDescription>
              </div>
              {result && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2" data-testid="button-copy-course">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2" data-testid="button-download-course">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            {courseMutation.isPending ? (
              <PageLoading text="Creating your learning path..." />
            ) : result ? (
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  {/* Course Overview */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground mb-4" data-testid="text-course-description">
                      {result.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{result.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{result.totalDuration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{result.modules.length} Modules</span>
                      </div>
                    </div>
                  </div>

                  {/* Modules Accordion */}
                  <Accordion type="multiple" className="space-y-3" defaultValue={["module-0"]}>
                    {result.modules.map((module, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`module-${index}`}
                        className="border rounded-lg px-4"
                        data-testid={`module-${index}`}
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold">{module.title}</h3>
                              <p className="text-sm text-muted-foreground">{module.duration}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-4 pl-11">
                            <p className="text-muted-foreground">{module.description}</p>

                            <div>
                              <h4 className="font-medium mb-2">Topics Covered</h4>
                              <div className="flex flex-wrap gap-2">
                                {module.topics.map((topic, topicIndex) => (
                                  <Badge 
                                    key={topicIndex} 
                                    variant="secondary"
                                    data-testid={`topic-${index}-${topicIndex}`}
                                  >
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Resources</h4>
                              <div className="space-y-2">
                                {module.resources.map((resource, resourceIndex) => {
                                  const IconComponent = resourceIcons[resource.type] || FileText;
                                  return (
                                    <div 
                                      key={resourceIndex}
                                      className="flex items-center gap-3 p-2 rounded-md bg-muted/50 hover-elevate"
                                      data-testid={`resource-${index}-${resourceIndex}`}
                                    >
                                      <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
                                      <span className="text-sm flex-1">{resource.title}</span>
                                      <Badge variant="outline" className="text-xs capitalize shrink-0">
                                        {resource.type}
                                      </Badge>
                                      {resource.url && (
                                        <a 
                                          href={resource.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="shrink-0"
                                        >
                                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                        </a>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No Course Yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter a topic on the left and click "Generate Course" to create your learning roadmap
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
