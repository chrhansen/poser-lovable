import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2, CheckCircle, Play } from 'lucide-react';

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
              const stepProgress = Math.min(((progressData.progress / 100) * progressData.totalSteps.length), index + 1) - index;
              const clampedProgress = Math.max(0, Math.min(1, stepProgress)) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center space-y-3">
                  {/* Step Icon */}
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted ? 'bg-green-500/20 border-green-500 text-green-400' :
                    isCurrent ? 'bg-primary/20 border-primary text-primary' :
                    'bg-muted border-muted-foreground/30 text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isCurrent ? (
                      <Play className="w-5 h-5 animate-pulse" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                    
                    {/* Current step progress ring */}
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeOpacity="0.2"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="100.531"
                            strokeDashoffset={100.531 - (clampedProgress * 100.531) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="text-center">
                    <p className={`text-sm font-medium transition-colors ${
                      isCompleted ? 'text-green-400' :
                      isCurrent ? 'text-primary' :
                      'text-muted-foreground'
                    }`}>
                      {step}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(clampedProgress)}% complete
                      </p>
                    )}
                  </div>
                  
                  {/* Connector Line */}
                  {index < progressData.totalSteps.length - 1 && (
                    <div className={`hidden md:block absolute left-1/2 top-6 w-full h-0.5 transform translate-x-6 transition-colors ${
                      isCompleted ? 'bg-green-500' :
                      'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};