import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppSidebar } from "@/components/AppSidebar";
import { VideoUpload } from "@/components/VideoUpload";
import { EmailVerification } from "@/components/EmailVerification";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { ContactForm } from "@/components/ContactForm";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
  ComposedChart,
  ReferenceArea,
} from "recharts";
import {
  Download,
  Play,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Menu,
  Plus,
  Trash2,
  XCircle,
  Maximize,
  Minimize,
  Info,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types for FastAPI integration
interface AnalysisMetric {
  label: string;
  value: string;
  trend: string;
  progress?: number;
}

interface AnalysisArtifact {
  name: string;
  size: string;
  type: string;
  downloadUrl?: string;
}

interface AnalysisStats {
  processingTime: string;
  totalFrames: number;
  detectedPoses: number;
  accuracy: number;
}

interface AnalysisData {
  stats: AnalysisStats;
  videoUrl?: string;
  artifacts: AnalysisArtifact[];
  metrics: AnalysisMetric[];
  summary?: {
    overall: string;
    strengths: string;
    improvements: string;
  };
}

// Reusable Stat Card Component
const StatCard = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <Card className={`border-primary/20 bg-primary/5 ${className}`}>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
          <p className="text-lg sm:text-2xl font-bold text-gradient truncate">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Reusable Metric Card Component
const MetricCard = ({ metric }: { metric: AnalysisMetric }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">{metric.label}</span>
      <Badge variant="secondary" className="text-primary">
        {metric.trend}
      </Badge>
    </div>
    <div className="text-2xl font-bold text-gradient">{metric.value}</div>
    <Progress value={metric.progress || Math.random() * 100} className="h-2" />
  </div>
);

// Reusable Artifact Download Component
const ArtifactItem = ({
  artifact,
  onDownload,
}: {
  artifact: AnalysisArtifact;
  onDownload?: (artifact: AnalysisArtifact) => void;
}) => (
  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
    <div className="flex-1">
      <p className="font-medium text-sm">{artifact.name}</p>
      <p className="text-xs text-muted-foreground">{artifact.size}</p>
    </div>
    <Badge variant="outline" className="mr-3 text-xs">
      {artifact.type}
    </Badge>
    <Button size="sm" variant="ghost" className="hover:bg-primary/10" onClick={() => onDownload?.(artifact)}>
      <Download className="w-4 h-4" />
    </Button>
  </div>
);

const Results = () => {
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<"upload" | "verify">("upload");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [theaterMode, setTheaterMode] = useState(false);

  // Check URL params to determine if this should show a failed analysis
  const urlParams = new URLSearchParams(window.location.search);
  const isFailed = urlParams.get("failed") === "true";

  const [isAnalysisComplete, setIsAnalysisComplete] = useState(!isFailed);
  const [isAnalysisFailed, setIsAnalysisFailed] = useState(isFailed);
  const [failureReason, setFailureReason] = useState(
    "The video processing encountered an unexpected error during pose detection. This could be due to poor video quality, insufficient lighting, or unsupported video format.",
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock video filename - this would come from the API response
  const videoFilename = isFailed ? "ski_session_blurry.mp4" : "morning_run_HD.mp4";

  // This would come from URL params or props in a real app
  const analysisId = "sample-analysis-id";

  // Mock data for demonstration - replace with FastAPI response
  const analysisData: AnalysisData = {
    stats: {
      processingTime: "2m 34s",
      totalFrames: 1847,
      detectedPoses: 1823,
      accuracy: 98.7,
    },
    videoUrl: "/placeholder.svg", // This would be the processed video URL from FastAPI
    artifacts: [
      { name: "pose_data.csv", size: "2.4 MB", type: "CSV" },
      { name: "angle_analysis.csv", size: "1.8 MB", type: "CSV" },
      { name: "performance_chart.png", size: "856 KB", type: "PNG" },
      { name: "trajectory_plot.png", size: "1.2 MB", type: "PNG" },
      { name: "comparison_graph.png", size: "945 KB", type: "PNG" },
    ],
    metrics: [
      { label: "Knee Angle Range", value: "142°", trend: "+5%", progress: 85 },
      { label: "Hip Flexion", value: "89°", trend: "-2%", progress: 72 },
      { label: "Balance Score", value: "8.7/10", trend: "+12%", progress: 87 },
      { label: "Symmetry Index", value: "94%", trend: "+8%", progress: 94 },
    ],
    summary: {
      overall: "Your skiing technique shows excellent form with consistent balance and controlled movements.",
      strengths: "Maintained good knee angle range and demonstrated strong symmetry throughout the run.",
      improvements: "Consider working on hip flexion consistency during turns.",
    },
  };

  // Mock edge similarity data for graph - this would come from FastAPI
  const edgeSimilarityData = [
    { time: 0, similarity: 85 },
    { time: 1, similarity: 88 },
    { time: 2, similarity: 92 },
    { time: 3, similarity: 89 },
    { time: 4, similarity: 94 },
    { time: 5, similarity: 91 },
    { time: 6, similarity: 87 },
    { time: 7, similarity: 93 },
    { time: 8, similarity: 96 },
    { time: 9, similarity: 90 },
    { time: 10, similarity: 88 },
    { time: 11, similarity: 92 },
    { time: 12, similarity: 95 },
    { time: 13, similarity: 91 },
    { time: 14, similarity: 89 },
    { time: 15, similarity: 93 },
  ];

  // Mock turn indicator data with durations - this would come from FastAPI
  const turnIndicators = [
    { startTime: 1.5, endTime: 3, type: "left" as const },
    { startTime: 4, endTime: 5.5, type: "right" as const },
    { startTime: 6.5, endTime: 8, type: "left" as const },
    { startTime: 9, endTime: 10.5, type: "right" as const },
    { startTime: 11.5, endTime: 13, type: "left" as const },
    { startTime: 14, endTime: 15.5, type: "right" as const },
  ];

  // Combine data for ComposedChart - create data points every 0.1s for smooth bars
  const combinedChartData = [];
  for (let i = 0; i <= 150; i++) {
    // 0 to 15 seconds in 0.1s increments
    const time = i / 10;
    const dataPoint = edgeSimilarityData.find((d) => d.time === Math.round(time));

    // Find active turn at this time point
    const activeTurn = turnIndicators.find((turn) => time >= turn.startTime && time <= turn.endTime);

    combinedChartData.push({
      time,
      similarity: dataPoint?.similarity || 0,
      leftTurn: activeTurn?.type === "left" ? 100 : 0,
      rightTurn: activeTurn?.type === "right" ? 100 : 0,
    });
  }

  const chartConfig = {
    similarity: {
      label: "Edge Similarity",
      color: "hsl(var(--primary))",
    },
    leftTurn: {
      label: "Left Turn",
      color: "#3b82f6",
    },
    rightTurn: {
      label: "Right Turn",
      color: "#f97316",
    },
  };

  // Handler functions for FastAPI integration
  const handleVideoPlay = () => {
    // TODO: Implement video playback logic
    console.log("Playing video:", analysisData.videoUrl);
  };

  const handleVideoDownload = () => {
    // TODO: Implement video download logic with FastAPI endpoint
    console.log("Downloading processed video:", analysisData.videoUrl);
  };

  const handleToggleTheater = () => {
    setTheaterMode(!theaterMode);
  };

  const handleArtifactDownload = (artifact: AnalysisArtifact) => {
    // TODO: Implement download logic with FastAPI endpoint
    console.log("Downloading artifact:", artifact.name);
  };

  const handleDownloadAll = () => {
    // TODO: Implement bulk download logic
    console.log("Downloading all artifacts");
  };

  const handleShare = () => {
    // TODO: Implement sharing logic
    console.log("Sharing results");
  };

  const handleAnalyzeAnother = () => {
    setShowNewAnalysis(true);
    setAnalysisStep("upload");
    setUploadedVideo(null);
  };

  const handleNewVideoUpload = (file: File) => {
    setUploadedVideo(file);
    // Skip email verification for signed-in users
    setAnalysisStep("verify");
    // TODO: For signed-in users, directly start analysis
    console.log("Starting analysis for signed-in user with video:", file.name);
  };

  const handleEmailVerified = () => {
    // TODO: Navigate to new analysis results
    setShowNewAnalysis(false);
    console.log("Email verified, starting new analysis for video:", uploadedVideo?.name);
  };

  const handleDeleteAnalysis = async () => {
    try {
      // TODO: Implement API call to delete analysis
      const response = await fetch(`/api/analysis/${analysisId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Analysis deleted successfully");
        // TODO: Navigate back to dashboard or analyses list
        // For now, just close the confirmation
        setShowDeleteConfirm(false);
      } else {
        console.error("Failed to delete analysis");
      }
    } catch (error) {
      console.error("Error deleting analysis:", error);
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header with toggle */}
          <header className="h-16 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm sticky top-0 z-0">
            <div className="flex items-center gap-2 px-4 sm:gap-4 sm:px-6 min-w-0 flex-1">
              <SidebarTrigger className="hover:bg-slate-800 text-slate-200 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-400 truncate">{videoFilename}</p>
              </div>
            </div>
            <div className="px-2 sm:px-6 shrink-0 flex items-center gap-2">
              <ContactForm />
              <Dialog open={showNewAnalysis} onOpenChange={setShowNewAnalysis}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Analysis
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-gradient">Start New Analysis</DialogTitle>
                    <DialogDescription>Upload a new skiing video for AI-powered pose analysis</DialogDescription>
                  </DialogHeader>
                  <div className="mt-6">
                    {analysisStep === "upload" ? (
                      <VideoUpload onVideoUpload={handleNewVideoUpload} isSignedIn={true} />
                    ) : (
                      <EmailVerification onVerified={handleEmailVerified} onBack={() => setAnalysisStep("upload")} />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Progress bar - only show when not failed */}
            {!isAnalysisFailed && (
              <AnalysisProgress analysisId={analysisId} onComplete={() => setIsAnalysisComplete(true)} />
            )}

            {/* Show failed analysis state */}
            {isAnalysisFailed && (
              <div className="max-w-2xl mx-auto">
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-12 text-center">
                    <XCircle className="w-20 h-20 text-destructive mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-destructive mb-2">Analysis Failed</h2>
                    <h3 className="text-lg font-medium text-foreground mb-4">{videoFilename}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto mb-8">
                      {failureReason}
                    </p>
                    <div className="flex justify-center">
                      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Analysis
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this failed analysis? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAnalysis}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Analysis
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Show results only when analysis is complete */}
            {isAnalysisComplete && !isAnalysisFailed && (
              <>
                <div className={`grid grid-cols-1 gap-4 sm:gap-8 ${theaterMode ? "" : "lg:grid-cols-3"}`}>
                  {/* Video Player Section */}
                  <div className={theaterMode ? "col-span-1" : "lg:col-span-2"}>
                    <Card className="border-primary/20">
                      <CardContent className="p-0">
                        <div
                          className={`${theaterMode ? "aspect-[21/9]" : "aspect-video"} bg-muted rounded-t-lg flex items-center justify-center`}
                        >
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gradient mb-2">Processed Video</p>
                            <p className="text-sm text-muted-foreground">Click to play your analyzed skiing video</p>
                            <Button className="mt-4" variant="default" onClick={handleVideoPlay}>
                              <Play className="w-4 h-4 mr-2" />
                              Play Video
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Processed Video with Pose Overlays</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleVideoDownload} className="gap-2">
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleToggleTheater}
                              className="gap-2 hidden md:flex"
                            >
                              {theaterMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                              {theaterMode ? "Default View" : "Theater Mode"}
                            </Button>
                          </div>
                        </div>
                        <CardDescription>
                          Your original video enhanced with AI-generated pose analysis overlays
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Edge Similarity Graph */}
                    {!theaterMode && (
                      <Card className="mt-6 border-primary/20">
                        <CardHeader>
                          <CardTitle>Edge Similarity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-blue-500" />
                              <span className="text-muted-foreground">Left Turns</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-orange-500" />
                              <span className="text-muted-foreground">Right Turns</span>
                            </div>
                          </div>
                          <div className="relative">
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                              <ComposedChart
                                data={combinedChartData}
                                margin={{
                                  left: 12,
                                  right: 12,
                                  top: 40,
                                  bottom: 12,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                  dataKey="time"
                                  tickLine={false}
                                  axisLine={false}
                                  tickMargin={8}
                                  tickFormatter={(value) => `${value}s`}
                                />
                                <YAxis
                                  tickLine={false}
                                  axisLine={false}
                                  tickMargin={8}
                                  domain={[0, 100]}
                                  tickFormatter={(value) => `${value}%`}
                                />
                                <ChartTooltip
                                  cursor={false}
                                  content={
                                    <ChartTooltipContent
                                      indicator="line"
                                      labelFormatter={(value) => {
                                        const turn = turnIndicators.find(
                                          (t) => value >= t.startTime && value <= t.endTime,
                                        );
                                        return turn
                                          ? `Time: ${value}s (${turn.type === "left" ? "Left" : "Right"} Turn - ${(turn.endTime - turn.startTime).toFixed(1)}s duration)`
                                          : `Time: ${value}s`;
                                      }}
                                      formatter={(value, name) => {
                                        if (name === "leftTurn" || name === "rightTurn") return null;
                                        return [
                                          `${value}%`,
                                          chartConfig[name as keyof typeof chartConfig]?.label || name,
                                        ];
                                      }}
                                    />
                                  }
                                />
                                {/* ReferenceArea components for turn indicators */}
                                {turnIndicators.map((turn, index) => (
                                  <ReferenceArea
                                    key={index}
                                    x1={turn.startTime}
                                    x2={turn.endTime}
                                    y1={0}
                                    y2={100}
                                    fill={turn.type === "left" ? "#3b82f6" : "#f97316"}
                                    fillOpacity={0.3}
                                    stroke="none"
                                  />
                                ))}
                                {/* Area chart for edge similarity */}
                                <Area
                                  dataKey="similarity"
                                  type="monotone"
                                  fill="hsl(var(--primary))"
                                  fillOpacity={0.4}
                                  stroke="hsl(var(--primary))"
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </ComposedChart>
                            </ChartContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Downloads Section */}
                  {!theaterMode && (
                    <div className="space-y-6">
                      {/* Edge Similarity Metrics */}
                      <div className="space-y-3">
                        {/* Combined Edge Similarity Score */}
                        <Card className="border-primary/20 bg-primary/5">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                                <div className="w-4 h-4 rounded-full bg-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-2xl font-bold text-gradient">89%</p>
                                <div className="flex items-center gap-1">
                                  <p className="text-sm text-muted-foreground">Edge Similarity Score</p>
                                  <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <p className="text-sm">
                                          Edge Similarity is a measure of how parallel your shins, thereby ski edges,
                                          are during a turn. The score is based on the best 4 consecutive turns.
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Left and Right Turn Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-muted-foreground leading-tight italic">Not enough left turns</p>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <p className="text-xs text-muted-foreground/60">Left Turns</p>
                                    <TooltipProvider delayDuration={200}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-3 w-3 text-muted-foreground/60 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          <p className="text-sm">Best rolling median of 3 consecutive left turns</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xl font-bold text-gradient">91%</p>
                                  <div className="flex items-center gap-1">
                                    <p className="text-xs text-muted-foreground">Right Turns</p>
                                    <TooltipProvider delayDuration={200}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          <p className="text-sm">Best rolling median of 3 consecutive right turns</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full" onClick={handleShare}>
                          Share Results
                        </Button>

                        {/* Delete Analysis Button */}
                        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Analysis
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this analysis? This action cannot be undone and will
                                permanently remove all associated data, files, and results.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteAnalysis}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Analysis
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <Card className="border-primary/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5 text-primary" />
                            Download Results
                          </CardTitle>
                          <CardDescription>Get detailed analysis data and visualizations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {analysisData.artifacts.map((artifact, index) => (
                            <ArtifactItem key={index} artifact={artifact} onDownload={handleArtifactDownload} />
                          ))}

                          <div className="pt-4 border-t border-primary/20">
                            <Button className="w-full" size="lg" onClick={handleDownloadAll}>
                              <Download className="w-4 h-4 mr-2" />
                              Download All Files
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Theater Mode: Show Performance Metrics and Downloads below video */}
                  {theaterMode && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-8">
                      {/* Performance Metrics */}
                      <Card className="border-primary/20">
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                          <CardDescription>Key measurements from your skiing technique</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-6">
                            {analysisData.metrics.map((metric, index) => (
                              <MetricCard key={index} metric={metric} />
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Downloads and Summary Section */}
                      <div className="space-y-6">
                        <Card className="border-primary/20">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Download className="w-5 h-5 text-primary" />
                              Download Results
                            </CardTitle>
                            <CardDescription>Get detailed analysis data and visualizations</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {analysisData.artifacts.map((artifact, index) => (
                              <ArtifactItem key={index} artifact={artifact} onDownload={handleArtifactDownload} />
                            ))}

                            <div className="pt-4 border-t border-primary/20">
                              <Button className="w-full" size="lg" onClick={handleDownloadAll}>
                                <Download className="w-4 h-4 mr-2" />
                                Download All Files
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Analysis Summary */}
                        <Card className="border-primary/20">
                          <CardHeader>
                            <CardTitle>Analysis Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {analysisData.summary && (
                              <div className="text-sm text-muted-foreground">
                                <p className="mb-2">
                                  <strong className="text-foreground">Overall Performance:</strong>{" "}
                                  {analysisData.summary.overall}
                                </p>
                                <p className="mb-2">
                                  <strong className="text-foreground">Key Strengths:</strong>{" "}
                                  {analysisData.summary.strengths}
                                </p>
                                <p>
                                  <strong className="text-foreground">Areas for Improvement:</strong>{" "}
                                  {analysisData.summary.improvements}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full" onClick={handleShare}>
                            Share Results
                          </Button>

                          {/* Delete Analysis Button */}
                          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Analysis
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this analysis? This action cannot be undone and will
                                  permanently remove all associated data, files, and results.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteAnalysis}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Analysis
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Results;
