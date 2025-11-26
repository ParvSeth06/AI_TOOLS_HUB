import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  comingSoon?: boolean;
}

export function ToolCard({ title, description, icon: Icon, href, gradient, comingSoon }: ToolCardProps) {
  return (
    <Card className="group relative overflow-visible border hover-elevate transition-all duration-300">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg ${gradient}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${gradient} text-white shadow-lg`}>
            <Icon className="h-6 w-6" />
          </div>
          {comingSoon && (
            <Badge variant="secondary" className="text-xs">
              Coming Soon
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-4">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {comingSoon ? (
          <Button variant="secondary" disabled className="w-full" data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}-disabled`}>
            Coming Soon
          </Button>
        ) : (
          <Link href={href}>
            <Button className="w-full" data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              Try Now
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
