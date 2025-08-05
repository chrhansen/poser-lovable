import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
}

export const VideoUpload = ({ onVideoUpload }: VideoUploadProps) => {
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
          className={`relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-500 group cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/10 scale-[1.02] shadow-glow"
              : "border-border hover:border-primary/50 hover:bg-card/30 hover:shadow-elegant"
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
              <Upload className={`w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground transition-all duration-300 ${
                dragActive ? 'scale-110 text-primary' : 'group-hover:scale-105 group-hover:text-primary/80'
              }`} />
              {dragActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-primary rounded-full animate-ping opacity-30" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground group-hover:text-gradient transition-all duration-300">
              {dragActive ? "Drop your video here!" : "Drop your skiing video here"}
            </h3>
            
            <p className="text-muted-foreground mb-6 text-sm md:text-base font-medium">
              Or click to browse your files
            </p>
            
            <div className="space-y-4">
              <p className="text-xs md:text-sm text-muted-foreground/80">
                Supports MP4, MOV, AVI • Max 500MB
              </p>
              
              <Button
                size="lg"
                className="px-8 py-3 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                Choose Video File
              </Button>
            </div>
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
            Continue to Email Verification
          </Button>
        </div>
      )}
    </div>
  );
};