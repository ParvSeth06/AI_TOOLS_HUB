import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Send, User, Bot, Sparkles, RefreshCw } from "lucide-react";
import type { Persona, ChatMessage } from "@shared/schema";

export default function PersonaFlow() {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [persona, setPersona] = useState<Persona>({
    name: "",
    background: "",
    communicationStyle: "",
    personality: "",
  });
  
  const [personaCreated, setPersonaCreated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest("POST", "/api/persona-flow/chat", {
        persona,
        messages,
        userMessage,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: currentMessage },
        { role: "assistant", content: data.response },
      ]);
      setCurrentMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCreatePersona = () => {
    if (!persona.name || !persona.background || !persona.communicationStyle || !persona.personality) {
      toast({
        title: "Missing Information",
        description: "Please fill in all persona fields.",
        variant: "destructive",
      });
      return;
    }
    setPersonaCreated(true);
    setMessages([
      {
        role: "assistant",
        content: `Hello! I'm ${persona.name}. ${persona.background.split('.')[0]}. Feel free to chat with me!`,
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || chatMutation.isPending) return;
    chatMutation.mutate(currentMessage);
  };

  const handleReset = () => {
    setPersonaCreated(false);
    setMessages([]);
    setPersona({
      name: "",
      background: "",
      communicationStyle: "",
      personality: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">PersonaFlow</h1>
          <p className="text-muted-foreground">Create custom AI characters and chat with them</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Persona Creation Panel */}
        <Card className={personaCreated ? "opacity-75" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Create Your Persona
            </CardTitle>
            <CardDescription>
              Define the character you want to chat with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Character Name</Label>
              <Input
                id="name"
                placeholder="e.g., Professor Einstein, Captain Sparrow"
                value={persona.name}
                onChange={(e) => setPersona({ ...persona, name: e.target.value })}
                disabled={personaCreated}
                data-testid="input-persona-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="background">Background Story</Label>
              <Textarea
                id="background"
                placeholder="Describe their history, experiences, and expertise..."
                value={persona.background}
                onChange={(e) => setPersona({ ...persona, background: e.target.value })}
                disabled={personaCreated}
                className="min-h-[100px]"
                data-testid="input-persona-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Communication Style</Label>
              <Input
                id="style"
                placeholder="e.g., formal and academic, witty and sarcastic"
                value={persona.communicationStyle}
                onChange={(e) => setPersona({ ...persona, communicationStyle: e.target.value })}
                disabled={personaCreated}
                data-testid="input-persona-style"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Personality Traits</Label>
              <Input
                id="personality"
                placeholder="e.g., curious, patient, enthusiastic"
                value={persona.personality}
                onChange={(e) => setPersona({ ...persona, personality: e.target.value })}
                disabled={personaCreated}
                data-testid="input-persona-personality"
              />
            </div>

            <div className="flex gap-2">
              {!personaCreated ? (
                <Button onClick={handleCreatePersona} className="w-full" data-testid="button-create-persona">
                  Create Persona
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline" className="w-full gap-2" data-testid="button-reset-persona">
                  <RefreshCw className="h-4 w-4" />
                  Start Over
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Panel */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Chat with {persona.name || "Your Persona"}
            </CardTitle>
            <CardDescription>
              {personaCreated 
                ? `Chatting with ${persona.name}` 
                : "Create a persona to start chatting"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              {!personaCreated ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No Persona Created</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Fill in the persona details on the left to start a conversation
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      data-testid={`message-${message.role}-${index}`}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}>
                          {message.role === "user" ? <User className="h-4 w-4" /> : persona.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-secondary">
                          {persona.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted">
                        <LoadingSpinner size="sm" text="Thinking..." />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-2 pt-4 border-t mt-auto">
              <Input
                placeholder={personaCreated ? "Type your message..." : "Create a persona first"}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                disabled={!personaCreated || chatMutation.isPending}
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!personaCreated || !currentMessage.trim() || chatMutation.isPending}
                size="icon"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
