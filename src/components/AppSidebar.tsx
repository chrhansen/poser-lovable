import React from 'react';
import { Clock, BarChart3, Play, ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

// Types for previous analyses
interface PreviousAnalysis {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
  accuracy?: number;
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  // Mock data for previous analyses - replace with FastAPI response
  const previousAnalyses: PreviousAnalysis[] = [
    {
      id: '1',
      title: 'Skiing Session - Morning Run',
      date: '2024-01-15',
      duration: '3:45',
      status: 'completed',
      accuracy: 98.7
    },
    {
      id: '2',
      title: 'Practice Session',
      date: '2024-01-14',
      duration: '2:30',
      status: 'completed',
      accuracy: 96.2
    },
    {
      id: '3',
      title: 'Competition Analysis',
      date: '2024-01-12',
      duration: '5:12',
      status: 'completed',
      accuracy: 99.1
    },
    {
      id: '4',
      title: 'Training Session',
      date: '2024-01-10',
      duration: '4:20',
      status: 'completed',
      accuracy: 97.8
    },
    {
      id: '5',
      title: 'Technique Review',
      date: '2024-01-08',
      duration: '1:55',
      status: 'processing'
    }
  ];

  const handleAnalysisClick = (analysisId: string) => {
    // TODO: Navigate to specific analysis results
    console.log('Loading analysis:', analysisId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complete';
      case 'processing': return 'Processing';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-80"} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-primary/20">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-semibold text-gradient">Pose Analysis</h2>
            <p className="text-sm text-muted-foreground">Previous analyses</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Recent Analyses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {previousAnalyses.map((analysis) => (
                <SidebarMenuItem key={analysis.id}>
                  <SidebarMenuButton
                    className="h-auto p-3 hover:bg-primary/5 border border-transparent hover:border-primary/20 rounded-lg"
                    onClick={() => handleAnalysisClick(analysis.id)}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 mr-3">
                        {analysis.status === 'completed' ? (
                          <BarChart3 className="w-5 h-5 text-primary" />
                        ) : analysis.status === 'processing' ? (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <Play className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium truncate">
                              {analysis.title}
                            </h4>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span>{analysis.date}</span>
                            <span>{analysis.duration}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(analysis.status)}`}
                            >
                              {getStatusText(analysis.status)}
                            </Badge>
                            {analysis.accuracy && (
                              <span className="text-xs font-medium text-primary">
                                {analysis.accuracy}%
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}