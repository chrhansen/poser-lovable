import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Play, BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Results = () => {
  // Mock data for demonstration
  const analysisData = {
    processingTime: "2m 34s",
    totalFrames: 1847,
    detectedPoses: 1823,
    accuracy: 98.7,
    videoUrl: "/placeholder.svg", // This would be the processed video URL
    artifacts: [
      { name: "pose_data.csv", size: "2.4 MB", type: "CSV" },
      { name: "angle_analysis.csv", size: "1.8 MB", type: "CSV" },
      { name: "performance_chart.png", size: "856 KB", type: "PNG" },
      { name: "trajectory_plot.png", size: "1.2 MB", type: "PNG" },
      { name: "comparison_graph.png", size: "945 KB", type: "PNG" }
    ],
    metrics: [
      { label: "Knee Angle Range", value: "142°", trend: "+5%" },
      { label: "Hip Flexion", value: "89°", trend: "-2%" },
      { label: "Balance Score", value: "8.7/10", trend: "+12%" },
      { label: "Symmetry Index", value: "94%", trend: "+8%" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">Analysis Complete</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your skiing video has been successfully analyzed. Review the results below.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Processing Time</p>
                  <p className="text-2xl font-bold text-gradient">{analysisData.processingTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Frames</p>
                  <p className="text-2xl font-bold text-gradient">{analysisData.totalFrames.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Poses Detected</p>
                  <p className="text-2xl font-bold text-gradient">{analysisData.detectedPoses.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold text-gradient">{analysisData.accuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <Button className="mt-4" variant="default">
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
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <Badge variant="secondary" className="text-primary">
                          {metric.trend}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gradient">{metric.value}</div>
                      <Progress value={Math.random() * 100} className="h-2" />
                    </div>
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
                  <div key={index} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{artifact.name}</p>
                      <p className="text-xs text-muted-foreground">{artifact.size}</p>
                    </div>
                    <Badge variant="outline" className="mr-3 text-xs">
                      {artifact.type}
                    </Badge>
                    <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-primary/20">
                  <Button className="w-full" size="lg">
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
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    <strong className="text-foreground">Overall Performance:</strong> Your skiing technique shows excellent form with consistent balance and controlled movements.
                  </p>
                  <p className="mb-2">
                    <strong className="text-foreground">Key Strengths:</strong> Maintained good knee angle range and demonstrated strong symmetry throughout the run.
                  </p>
                  <p>
                    <strong className="text-foreground">Areas for Improvement:</strong> Consider working on hip flexion consistency during turns.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Share Results
              </Button>
              <Button variant="secondary" className="w-full">
                Analyze Another Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;