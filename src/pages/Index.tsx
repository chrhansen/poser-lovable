import { useState } from "react";
import { VideoUpload } from "@/components/VideoUpload";
import { EmailVerification } from "@/components/EmailVerification";
import { Mountain, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [step, setStep] = useState<"upload" | "verify">("upload");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    setStep("verify");
  };

  const handleEmailVerified = () => {
    // Here you would typically send the video to your FastAPI backend
    console.log("Email verified, processing video:", uploadedVideo?.name);
  };

  const scrollToInfo = () => {
    document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Upload Section - Full Screen */}
      <section className="min-h-screen flex flex-col">
        {/* Minimal Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Mountain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Poser</h1>
          </div>
        </header>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-6">
          <div className="w-full max-w-2xl">
            {step === "upload" && (
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                    Analyze Your Ski Technique
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
                    Upload your skiing video for instant pose analysis
                  </p>
                </div>
                <VideoUpload onVideoUpload={handleVideoUpload} />
              </div>
            )}
            {step === "verify" && (
              <EmailVerification 
                onVerified={handleEmailVerified}
                onBack={() => setStep("upload")}
              />
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        {step === "upload" && (
          <div className="text-center pb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToInfo}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </Button>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section id="info-section" className="py-16 md:py-24 px-4 md:px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              How It Works
            </h3>
            <p className="text-muted-foreground text-lg">
              Get detailed insights, downloadable data, and visual overlays to improve your technique
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold text-foreground">Upload Video</h4>
              <p className="text-muted-foreground text-sm">
                Drop your skiing video and verify your email
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold text-foreground">AI Analysis</h4>
              <p className="text-muted-foreground text-sm">
                Our AI extracts pose data and analyzes your technique
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold text-foreground">Get Results</h4>
              <p className="text-muted-foreground text-sm">
                Download enhanced video, data files, and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-muted-foreground border-t border-border">
        <p className="text-sm">© 2024 Poser.pro - Ski Pose Analysis</p>
      </footer>
    </div>
  );
};

export default Index;
