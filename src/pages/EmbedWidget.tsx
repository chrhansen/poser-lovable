import { useState, useRef, useEffect } from "react";
import { Upload, Mail, Loader2, Play, Pause, Scissors, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

type WidgetStep = "upload" | "trim" | "email" | "processing" | "results";

const EmbedWidget = () => {
  const [step, setStep] = useState<WidgetStep>("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [trimRange, setTrimRange] = useState([0, 100]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated results data
  const resultsData = {
    edgeSimilarity: 76,
    turnsAnalyzed: 8,
    videoUrl: videoUrl,
  };

  useEffect(() => {
    if (step === "processing") {
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("results"), 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setStep("trim");
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleTrimChange = (values: number[]) => {
    setTrimRange(values);
    if (videoRef.current && videoDuration > 0) {
      videoRef.current.currentTime = (values[0] / 100) * videoDuration;
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setStep("processing");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStartTime = () => formatTime((trimRange[0] / 100) * videoDuration);
  const getEndTime = () => formatTime((trimRange[1] / 100) * videoDuration);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Widget Container - This is what would be embedded */}
      <Card className="w-full max-w-md bg-slate-800/90 border-slate-700 shadow-2xl backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-white font-semibold">Poser Analysis</span>
            </div>
            {step !== "upload" && step !== "results" && (
              <div className="flex gap-1">
                {["trim", "email", "processing"].map((s, i) => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step === s
                        ? "bg-blue-500"
                        : ["trim", "email", "processing"].indexOf(step) > i
                        ? "bg-blue-500/50"
                        : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Step: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500/50 hover:bg-slate-700/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-white font-medium mb-1">Upload your ski video</p>
                <p className="text-slate-400 text-sm">MP4, MOV, or WebM • Max 500MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-slate-500 text-xs text-center">
                Your video will be analyzed for ski technique metrics
              </p>
            </div>
          )}

          {/* Step: Trim */}
          {step === "trim" && videoUrl && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onLoadedMetadata={handleVideoLoaded}
                  className="w-full aspect-video object-contain"
                  playsInline
                />
                <button
                  onClick={togglePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </div>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Scissors className="w-4 h-4" />
                  <span>Select the section to analyze</span>
                </div>
                
                <div className="px-1">
                  <Slider
                    value={trimRange}
                    onValueChange={handleTrimChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1 text-slate-400">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="font-mono">{getStartTime()}</span>
                  </div>
                  <div className="text-slate-500 text-xs">
                    Duration: {formatTime(((trimRange[1] - trimRange[0]) / 100) * videoDuration)}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="font-mono">{getEndTime()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep("email")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step: Email */}
          {step === "email" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-medium mb-1">Enter your email</h3>
                <p className="text-slate-400 text-sm">
                  We'll send you a link to view your analysis results
                </p>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
                {emailError && (
                  <p className="text-red-400 text-sm">{emailError}</p>
                )}
              </div>

              <Button
                onClick={handleEmailSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Analyze My Video
              </Button>

              <button
                onClick={() => setStep("trim")}
                className="w-full text-slate-400 text-sm hover:text-white transition-colors"
              >
                ← Back to video
              </button>

              <p className="text-slate-500 text-xs text-center">
                By submitting, you agree to receive analysis results via email
              </p>
            </div>
          )}

          {/* Step: Processing */}
          {step === "processing" && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4 relative">
                  <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                </div>
                <h3 className="text-white font-medium mb-1">Analyzing your video</h3>
                <p className="text-slate-400 text-sm">
                  This usually takes 1-2 minutes
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Processing</span>
                  <span className="text-blue-400">{Math.min(100, Math.round(processingProgress))}%</span>
                </div>
                <Progress value={Math.min(100, processingProgress)} className="h-2" />
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-slate-300 text-sm">
                  📧 We'll email you at <span className="text-blue-400">{email}</span> when ready
                </p>
              </div>
            </div>
          )}

          {/* Step: Results */}
          {step === "results" && videoUrl && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <Check className="w-5 h-5" />
                <span className="font-medium">Analysis Complete</span>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  src={videoUrl}
                  controls
                  className="w-full aspect-video object-contain"
                  playsInline
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {resultsData.edgeSimilarity}%
                  </div>
                  <div className="text-slate-400 text-sm">Edge Similarity</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {resultsData.turnsAnalyzed}
                  </div>
                  <div className="text-slate-400 text-sm">Turns Analyzed</div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-300 text-sm text-center">
                  Full detailed analysis sent to your email!
                </p>
              </div>

              <Button
                onClick={() => {
                  setStep("upload");
                  setVideoFile(null);
                  setVideoUrl(null);
                  setEmail("");
                  setProcessingProgress(0);
                  setTrimRange([0, 100]);
                }}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Analyze Another Video
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
            <p className="text-slate-500 text-xs">
              Powered by <span className="text-blue-400">Poser</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbedWidget;
