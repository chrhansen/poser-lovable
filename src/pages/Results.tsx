import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AppSidebar } from '@/components/AppSidebar';
import { VideoUpload } from '@/components/VideoUpload';
import { EmailVerification } from '@/components/EmailVerification';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { Download, Play, BarChart3, TrendingUp, Clock, CheckCircle, Menu, Plus, Trash2, XCircle } from 'lucide-react';

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
const StatCard = ({ icon: Icon, label, value, className = "" }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <Card className={`border-primary/20 bg-primary/5 ${className}`}>
    <CardContent className="p-6">
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-gradient">{value}</p>
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
const ArtifactItem = ({ artifact, onDownload }: {
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
    <Button 
      size="sm" 
      variant="ghost" 
      className="hover:bg-primary/10"
      onClick={() => onDownload?.(artifact)}
    >
      <Download className="w-4 h-4" />
    </Button>
  </div>
);

const Results = () => {
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<"upload" | "verify">("upload");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  
  // Check URL params to determine if this should show a failed analysis
  const urlParams = new URLSearchParams(window.location.search);
  const isFailed = urlParams.get('failed') === 'true';
  
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(!isFailed);
  const [isAnalysisFailed, setIsAnalysisFailed] = useState(isFailed);
  const [failureReason, setFailureReason] = useState("The video processing encountered an unexpected error during pose detection. This could be due to poor video quality, insufficient lighting, or unsupported video format.");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
      { name: "comparison_graph.png", size: "945 KB", type: "PNG" }
    ],
    metrics: [
      { label: "Knee Angle Range", value: "142°", trend: "+5%", progress: 85 },
      { label: "Hip Flexion", value: "89°", trend: "-2%", progress: 72 },
      { label: "Balance Score", value: "8.7/10", trend: "+12%", progress: 87 },
      { label: "Symmetry Index", value: "94%", trend: "+8%", progress: 94 }
    ],
    summary: {
      overall: "Your skiing technique shows excellent form with consistent balance and controlled movements.",
      strengths: "Maintained good knee angle range and demonstrated strong symmetry throughout the run.",
      improvements: "Consider working on hip flexion consistency during turns."
    }
  };

  // Handler functions for FastAPI integration
  const handleVideoPlay = () => {
    // TODO: Implement video playback logic
    console.log('Playing video:', analysisData.videoUrl);
  };

  const handleArtifactDownload = (artifact: AnalysisArtifact) => {
    // TODO: Implement download logic with FastAPI endpoint
    console.log('Downloading artifact:', artifact.name);
  };

  const handleDownloadAll = () => {
    // TODO: Implement bulk download logic
    console.log('Downloading all artifacts');
  };

  const handleShare = () => {
    // TODO: Implement sharing logic
    console.log('Sharing results');
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
    console.log('Starting analysis for signed-in user with video:', file.name);
  };

  const handleEmailVerified = () => {
    // TODO: Navigate to new analysis results
    setShowNewAnalysis(false);
    console.log('Email verified, starting new analysis for video:', uploadedVideo?.name);
  };

  const handleDeleteAnalysis = async () => {
    try {
      // TODO: Implement API call to delete analysis
      const response = await fetch(`/api/analysis/${analysisId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log('Analysis deleted successfully');
        // TODO: Navigate back to dashboard or analyses list
        // For now, just close the confirmation
        setShowDeleteConfirm(false);
      } else {
        console.error('Failed to delete analysis');
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header with toggle */}
          <header className="h-16 flex items-center justify-between border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-0">
            <div className="flex items-center gap-4 px-6">
              <SidebarTrigger className="hover:bg-slate-800 text-slate-200" />
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-slate-100">Analysis Dashboard</h1>
              </div>
            </div>
            <div className="px-6">
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
                    <DialogDescription>
                      Upload a new skiing video for AI-powered pose analysis
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-6">
                    {analysisStep === "upload" ? (
                      <VideoUpload 
                        onVideoUpload={handleNewVideoUpload} 
                        isSignedIn={true}
                      />
                    ) : (
                      <EmailVerification 
                        onVerified={handleEmailVerified}
                        onBack={() => setAnalysisStep("upload")}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="container mx-auto px-6 py-8">
            {/* Progress bar - only show when not failed */}
            {!isAnalysisFailed && (
              <AnalysisProgress 
                analysisId={analysisId}
                onComplete={() => setIsAnalysisComplete(true)}
              />
            )}

            {/* Show failed analysis state */}
            {isAnalysisFailed && (
              <div className="max-w-2xl mx-auto">
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-12 text-center">
                    <XCircle className="w-20 h-20 text-destructive mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-destructive mb-4">Analysis Failed</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto mb-8">
                      {failureReason}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="default" onClick={handleAnalyzeAnother}>
                        Try Another Video
                      </Button>
                      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
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
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <StatCard 
                    icon={Clock} 
                    label="Processing Time" 
                    value={analysisData.stats.processingTime} 
                  />
                  <StatCard 
                    icon={BarChart3} 
                    label="Total Frames" 
                    value={analysisData.stats.totalFrames.toLocaleString()} 
                  />
                  <StatCard 
                    icon={TrendingUp} 
                    label="Poses Detected" 
                    value={analysisData.stats.detectedPoses.toLocaleString()} 
                  />
                  <StatCard 
                    icon={CheckCircle} 
                    label="Accuracy" 
                    value={`${analysisData.stats.accuracy}%`} 
                  />
                </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Processed Video with Pose Overlays
                </CardTitle>
                <CardDescription>
                  Your original video enhanced with AI-generated pose analysis overlays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gradient mb-2">Processed Video</p>
                    <p className="text-sm text-muted-foreground">Click to play your analyzed skiing video</p>
                    <Button className="mt-4" variant="default" onClick={handleVideoPlay}>
                      <Play className="w-4 h-4 mr-2" />
                      Play Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="mt-6 border-primary/20">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key measurements from your skiing technique</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisData.metrics.map((metric, index) => (
                    <MetricCard key={index} metric={metric} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Downloads Section */}
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Download Results
                </CardTitle>
                <CardDescription>
                  Get detailed analysis data and visualizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisData.artifacts.map((artifact, index) => (
                  <ArtifactItem 
                    key={index} 
                    artifact={artifact} 
                    onDownload={handleArtifactDownload}
                  />
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
                      <strong className="text-foreground">Overall Performance:</strong> {analysisData.summary.overall}
                    </p>
                    <p className="mb-2">
                      <strong className="text-foreground">Key Strengths:</strong> {analysisData.summary.strengths}
                    </p>
                    <p>
                      <strong className="text-foreground">Areas for Improvement:</strong> {analysisData.summary.improvements}
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
              <Button variant="secondary" className="w-full" onClick={handleAnalyzeAnother}>
                Analyze Another Video
              </Button>
              
              {/* Delete Analysis Button */}
              <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Analysis
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this analysis? This action cannot be undone and will permanently remove all associated data, files, and results.
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
            </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Results;