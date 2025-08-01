import { useState } from "react";
import { VideoUpload } from "@/components/VideoUpload";
import { EmailVerification } from "@/components/EmailVerification";
import { Snowflake, Mountain } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Mountain className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Poser</h1>
        </div>
        <Snowflake className="w-6 h-6 text-muted-foreground animate-pulse" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Analyze Your Ski Technique
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your skiing video and get instant pose analysis with detailed insights, 
            downloadable data, and visual overlays to improve your technique.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {step === "upload" && (
            <VideoUpload onVideoUpload={handleVideoUpload} />
          )}
          {step === "verify" && (
            <EmailVerification 
              onVerified={handleEmailVerified}
              onBack={() => setStep("upload")}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-muted-foreground">
        <p>© 2024 Poser.pro - Ski Pose Analysis</p>
      </footer>
    </div>
  );
};

export default Index;
