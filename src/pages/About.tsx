import { Link } from "react-router-dom";
import { Mountain, Linkedin, Github, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-glow">
              <Mountain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Poser</h1>
          </Link>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              About
            </h1>
            <p className="text-xl text-muted-foreground">
              The story behind Poser
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-card/50 border-border/50">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Hi, I'm the creator of Poser
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  I'm originally from Denmark, but I now live in the beautiful city of Innsbruck, Austria - 
                  surrounded by the Alps where skiing is a way of life. Being so close to world-class skiing, 
                  I wanted to create a tool that could help skiers analyze and improve their technique using 
                  the power of AI.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Poser combines computer vision and pose estimation to give you detailed insights into your 
                  skiing form, helping you become a better skier one run at a time.
                </p>
              </div>

              <div className="pt-6 border-t border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Connect with me
                </h3>
                <div className="flex gap-4">
                  <Button variant="outline" asChild>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="text-center py-12 text-muted-foreground border-t border-border/50 bg-card/20">
          <p className="text-sm font-medium">© 2025 Poser.pro</p>
        </footer>
      </div>
    </div>
  );
};

export default About;