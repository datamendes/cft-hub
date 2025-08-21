import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, FileText, Settings, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Meetings",
      description: "Schedule and manage CFT meetings with integrated agenda and proposal tracking",
      path: "/meetings",
      color: "text-blue-500"
    },
    {
      icon: FileText,
      title: "Proposals",
      description: "Submit, review, and track pharmaceutical proposals through the approval process",
      path: "/proposals", 
      color: "text-green-500"
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Access comprehensive documentation, guidelines, and reference materials",
      path: "/knowledge",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "Documents",
      description: "Manage and organize important documents with version control",
      path: "/documents",
      color: "text-orange-500"
    }
  ];

  const quickActions = [
    { title: "View Dashboard", path: "/", icon: Settings },
    { title: "Create Proposal", path: "/proposals", icon: FileText },
    { title: "Schedule Meeting", path: "/meetings", icon: Calendar },
    { title: "Browse Knowledge", path: "/knowledge", icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CFT Management System
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Streamline your Committee for Therapeutic Management with comprehensive 
              proposal tracking, meeting coordination, and knowledge management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/")}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/proposals")}>
                Create New Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive CFT Management</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your Committee for Therapeutic Management efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <Card 
              key={feature.path}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader className="text-center">
                <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-muted/50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.path}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="h-6 w-6" />
                <span>{action.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>CFT Management System - Streamlining pharmaceutical committee operations</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
