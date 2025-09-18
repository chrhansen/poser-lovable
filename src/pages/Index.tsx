import { useState } from "react";
import { VideoUpload } from "@/components/VideoUpload";
import { EmailVerification } from "@/components/EmailVerification";
import { LoginModal } from "@/components/LoginModal";
import { Mountain, ChevronDown, BarChart3, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [step, setStep] = useState<"upload" | "verify">("upload");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state - replace with your auth logic
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    setStep("verify");
  };

  const handleEmailVerified = () => {
    // Here you would typically send the video to your FastAPI backend
    console.log("Email verified, processing video:", uploadedVideo?.name);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const scrollToInfo = () => {
    document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Main Upload Section - Full Screen */}
      <section className="min-h-screen flex flex-col relative z-10">
        {/* Minimal Header */}
        <header className="flex items-center justify-between p-4 md:p-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-glow">
              <Mountain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Poser</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/about">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Button>
            </Link>
            {isLoggedIn ? (
              <Link to="/results">
                <Button variant="outline" className="flex items-center gap-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105">
                  <BarChart3 className="w-4 h-4" />
                  View Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
            )}
          </div>
        </header>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-6">
          <div className="w-full max-w-2xl">
            {step === "upload" && (
              <div className="text-center space-y-8 animate-slide-up">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
                    Analyze Your
                    <span className="block text-gradient">Ski Technique</span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed">
                    Upload your skiing video for instant pose analysis with AI-powered insights
                  </p>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  <VideoUpload onVideoUpload={handleVideoUpload} />
                </div>
              </div>
            )}
            {step === "verify" && (
              <div className="animate-fade-in">
                <EmailVerification 
                  onVerified={handleEmailVerified}
                  onBack={() => setStep("upload")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        {step === "upload" && (
          <div className="text-center pb-8 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToInfo}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </Button>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section id="info-section" className="py-20 md:py-32 px-4 md:px-6 bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-sm border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground tracking-tight">
              How It Works
            </h3>
            <p className="text-muted-foreground text-xl leading-relaxed font-medium max-w-2xl mx-auto">
              Get detailed insights, downloadable data, and visual overlays to improve your technique
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "1",
                title: "Upload Video",
                description: "Drop your skiing video and verify your email"
              },
              {
                step: "2", 
                title: "AI Analysis",
                description: "Our AI extracts pose data and analyzes your technique"
              },
              {
                step: "3",
                title: "Get Results", 
                description: "Download enhanced video, data files, and insights"
              }
            ].map((item, index) => (
              <div 
                key={item.step}
                className="text-center space-y-4 group hover:scale-105 transition-all duration-300"
                style={{ 
                  animationDelay: `${0.2 * index}s`, 
                  animationFillMode: 'both' 
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-glow transition-all duration-300 border border-primary/20">
                  <span className="text-primary font-bold text-xl">{item.step}</span>
                </div>
                <h4 className="font-semibold text-foreground text-lg">{item.title}</h4>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-muted-foreground border-t border-border/50 bg-card/20">
        <p className="text-sm font-medium">© 2025 Poser.pro</p>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Index;
