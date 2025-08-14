import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Download,
  Play,
  ChevronRight,
  ChevronLeft,
  FileVideo,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarItem 
} from '@/components/ui/sidebar'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { AnalysisResult, AnalysisSummary } from '@/types'

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Fetch analysis data
  useEffect(() => {
    if (!id || !token) {
      navigate('/')
      return
    }

    const fetchData = async () => {
      try {
        const [analysisData, analysesData] = await Promise.all([
          api.getAnalysis(id, token),
          api.getAnalyses(token)
        ])
        setAnalysis(analysisData)
        setAnalyses(analysesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, token, navigate])

  // Polling for processing status
  useEffect(() => {
    if (!analysis || !token || !id) return
    if (analysis.status !== 'processing') return

    const interval = setInterval(async () => {
      try {
        const data = await api.getAnalysis(id, token)
        setAnalysis(data)
        if (data.status !== 'processing') {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [analysis?.status, id, token])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-500'
      case 'processing':
        return 'text-yellow-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Analysis Not Found</h2>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Recent Analyses</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {analyses.map((item) => (
            <SidebarItem
              key={item.id}
              isActive={item.id === id}
              onClick={() => navigate(`/results/${item.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate">
                      {item.title || `Skiing Session - ${formatDate(item.created_at).split(' ')[0]}`}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatDate(item.created_at)}</span>
                      {item.duration && <span>{formatDuration(item.duration)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status === 'complete' ? `${item.accuracy || 0}%` : item.status}
                  </span>
                  {getStatusIcon(item.status)}
                </div>
              </div>
              {item.id === id && <ChevronRight className="h-4 w-4" />}
            </SidebarItem>
          ))}
        </SidebarContent>
      </Sidebar>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-4 z-50 p-2 bg-background border rounded-md transition-all ${
          sidebarOpen ? 'left-60' : 'left-4'
        }`}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Analysis Dashboard</h1>
            </div>

            {analysis.status === 'processing' ? (
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-primary">
                  Analysis In Progress
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your video is being processed. We'll update this page automatically when it's ready.
                </p>
                <Progress value={33} className="w-full max-w-md" />
              </div>
            ) : analysis.status === 'complete' ? (
              <div>
                <h2 className="text-4xl font-bold text-primary mb-2">
                  Analysis Complete
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your skiing video has been successfully analyzed. Review the results below.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-destructive">
                  Analysis Failed
                </h2>
                <p className="text-lg text-muted-foreground">
                  {analysis.error_log || 'An error occurred during analysis. Please try again.'}
                </p>
              </div>
            )}
          </div>

          {analysis.status === 'complete' && analysis.analysis_results && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {analysis.analysis_results.metrics?.total_frames && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Frames
                      </CardTitle>
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analysis.analysis_results.metrics.total_frames.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {analysis.analysis_results.metrics?.edge_similarity && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Edge Similarity
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(analysis.analysis_results.metrics.edge_similarity.mean * 100).toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Avg similarity
                      </p>
                    </CardContent>
                  </Card>
                )}

                {analysis.analysis_results.metrics?.edge_similarity && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pose Count
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analysis.analysis_results.metrics.edge_similarity.count.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Detected poses
                      </p>
                    </CardContent>
                  </Card>
                )}

                {analysis.analysis_results.status && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Analysis Status
                      </CardTitle>
                      <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold capitalize">
                        {analysis.analysis_results.status}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Complete
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Video and Downloads Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video Player */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Play className="h-5 w-5 text-primary" />
                      <CardTitle>Processed Video with Pose Overlays</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your original video enhanced with AI-generated pose analysis overlays
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video bg-secondary/20 rounded-lg border-2 border-dashed border-primary/40 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Play className="h-16 w-16 text-primary mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold">Processed Video</h3>
                          <p className="text-sm text-muted-foreground">
                            Click to play your analyzed skiing video
                          </p>
                        </div>
                        <Button size="lg">
                          <Play className="mr-2 h-4 w-4" />
                          Play Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Downloads Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Download className="h-5 w-5 text-primary" />
                      <CardTitle>Download Results</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get detailed analysis data and visualizations
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.analysis_results.outputs && Object.entries(analysis.analysis_results.outputs).map(([key, path]) => {
                        const filename = path.split('/').pop() || key
                        const fileType = filename.endsWith('.csv') ? 'CSV Data' : 
                                       filename.endsWith('.png') ? 'Image' : 
                                       filename.endsWith('.mp4') ? 'Video' : 
                                       filename.endsWith('.glb') ? '3D Model' :
                                       filename.endsWith('.html') ? 'Web View' : 'File'
                        
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <FileVideo className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{filename}</p>
                                <p className="text-xs text-muted-foreground">
                                  {fileType} • {key.replace(/_/g, ' ')}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const url = api.getAnalysisFileUrl(analysis.id, filename)
                                window.open(url, '_blank')
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-64 border-r p-4">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}