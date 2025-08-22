import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2, CheckCircle } from 'lucide-react';

interface AnalysisProgressData {
  status: 'processing' | 'complete' | 'error';
  currentStep: string;
  progress: number; // 0-100
  estimatedTimeRemaining: string;
  stepsCompleted: string[];
  totalSteps: string[];
}

interface AnalysisProgressProps {
  analysisId: string;
  onComplete?: () => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ 
  analysisId, 
  onComplete 
}) => {
  const [progressData, setProgressData] = useState<AnalysisProgressData>({
    status: 'processing',
    currentStep: 'Initializing analysis...',
    progress: 0,
    estimatedTimeRemaining: 'Calculating...',
    stepsCompleted: [],
    totalSteps: [
      'Video loading',
      'Pose detection',
      'Temporal smoothing', 
      'Metrics calculation',
      'Output preparation'
    ]
  });

  // Polling function to get progress updates
  const fetchProgress = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/analysis/${analysisId}/progress`);
      const data = await response.json();
      setProgressData(data);
      
      if (data.status === 'complete') {
        onComplete?.();
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Mock progress for demonstration
      setProgressData(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 15, 100),
        currentStep: prev.progress < 100 ? 'Processing video frames...' : 'Finalizing analysis...',
        estimatedTimeRemaining: prev.progress < 100 ? `${Math.ceil((100 - prev.progress) * 2)}s` : '0s'
      }));
    }
  };

  // Set up polling
  useEffect(() => {
    const interval = setInterval(fetchProgress, 2000); // Poll every 2 seconds
    fetchProgress(); // Initial fetch
    
    return () => clearInterval(interval);
  }, [analysisId]);

  const getProgressColor = () => {
    if (progressData.progress < 30) return 'text-yellow-400';
    if (progressData.progress < 70) return 'text-blue-400'; 
    return 'text-green-400';
  };

  return (
    <div className="mb-8">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {progressData.status === 'processing' ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-400" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gradient">
                  {progressData.status === 'complete' ? 'Analysis Complete' : 'Analyzing Video'}
                </h2>
                <p className="text-muted-foreground">
                  {progressData.status === 'complete' 
                    ? 'Your skiing video has been successfully analyzed'
                    : progressData.currentStep
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-3xl font-bold ${getProgressColor()}`}>
                {Math.round(progressData.progress)}%
              </div>
              {progressData.status === 'processing' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{progressData.estimatedTimeRemaining}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Progress Bar */}
          <div className="mb-6">
            <Progress 
              value={progressData.progress} 
              className="h-3 bg-slate-800/50"
            />
          </div>

          {/* Steps Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {progressData.totalSteps.map((step, index) => {
              const isCompleted = progressData.stepsCompleted.includes(step);
              const isCurrent = progressData.currentStep.toLowerCase().includes(step.toLowerCase());
              
              return (
                <div key={index} className="text-center">
                  <Badge 
                    variant={isCompleted ? "default" : isCurrent ? "secondary" : "outline"}
                    className={`w-full justify-center text-xs py-2 ${
                      isCompleted ? 'bg-green-600/20 text-green-400 border-green-600/30' :
                      isCurrent ? 'bg-primary/20 text-primary border-primary/30' :
                      'bg-slate-800/20 text-slate-400 border-slate-600/30'
                    }`}
                  >
                    {step}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};