import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Video, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import skierThumbnail from "@/assets/skier-demo-thumbnail.jpg";

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
  isSignedIn?: boolean;
}

export const VideoUpload = ({ onVideoUpload, isSignedIn = false }: VideoUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 500MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (selectedVideo) {
      onVideoUpload(selectedVideo);
    }
  };

  return (
    <div className="w-full">
      {!selectedVideo ? (
        <div
          className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-500 group cursor-pointer shadow-elegant ${
            dragActive
              ? "border-primary bg-primary/10 scale-[1.02] shadow-glow"
              : "border-primary bg-primary/10 hover:border-primary hover:shadow-glow"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="mb-6 relative">
              <Upload className={`w-12 h-12 md:w-16 md:h-16 mx-auto text-primary transition-all duration-300 ${
                dragActive ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              {dragActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-primary rounded-full animate-ping opacity-30" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gradient transition-all duration-300">
              {dragActive ? "Drop your video here!" : "Drag and Drop file here or"}
            </h3>
            
            {!dragActive && (
              <button 
                className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose file
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6 bg-gradient-to-br from-card/40 to-card/20 rounded-3xl p-6 border border-border/50 backdrop-blur-sm animate-scale-in">
          <div className="relative overflow-hidden rounded-2xl">
            <video
              src={videoPreview || ""}
              controls
              className="w-full max-h-64 bg-black rounded-2xl shadow-elegant"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 bg-background/90 hover:bg-background backdrop-blur-sm transition-all duration-300 hover:scale-110"
              onClick={removeVideo}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/30">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{selectedVideo.name}</p>
              <p className="text-sm text-muted-foreground font-medium">
                {(selectedVideo.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>

          <Button 
            onClick={handleUpload} 
            className="w-full py-3 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]" 
            size="lg"
          >
            {isSignedIn ? "Analyze Video" : "Continue to Email Verification"}
          </Button>
        </div>
      )}
      
      {/* Instructions section - outside dropzone */}
      {!selectedVideo && (
        <div className="mt-6 ml-12">
          <div className="flex flex-row items-start gap-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img 
                src={skierThumbnail} 
                alt="Example skiing video" 
                className="w-24 h-16 sm:w-32 sm:h-18 rounded-lg object-cover border border-border/50 shadow-sm"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center font-medium">Example video angle</p>
            </div>
            
            {/* Instructions */}
            <div className="space-y-3 min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-3">For best results:</h4>
              <div className="space-y-2">
                {[
                  "A good quality video",
                  "Skier is skiing towards the camera", 
                  "Best for short turns"
                ].map((instruction, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground font-medium">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};