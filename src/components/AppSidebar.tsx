import React from 'react';
import { Clock, BarChart3, Play, ChevronRight, ChevronLeft, ChevronRightIcon } from 'lucide-react';
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
  SidebarTrigger,
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
    <Sidebar className={`${collapsed ? "w-14" : "w-80"} bg-slate-900 border-slate-800 z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)]`} collapsible="icon">
      <div className="relative h-full">

        <SidebarContent className="bg-slate-900 flex flex-col h-full">
          <SidebarGroup className="flex-1">
            <SidebarGroupLabel className={`${collapsed ? "hidden" : ""} text-slate-300 p-4`}>
              Recent Analyses
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {previousAnalyses.map((analysis) => (
                  <SidebarMenuItem key={analysis.id}>
                    <SidebarMenuButton
                      className="h-auto p-3 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-lg text-slate-200 hover:text-slate-200"
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
                              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                              <span>{analysis.date}</span>
                              <span>{analysis.duration}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant="outline"
                                className={`text-xs border-slate-700 ${getStatusColor(analysis.status)}`}
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
          
          {/* Divider and toggle button at bottom */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex justify-end">
              <SidebarTrigger className="hover:bg-slate-800 text-slate-200 bg-slate-900 border border-slate-700 rounded-full p-2 shadow-lg">
                {collapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </SidebarTrigger>
            </div>
          </div>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}