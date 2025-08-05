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
          className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-200 ${
            dragActive
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-card/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
            Drop your skiing video here
          </h3>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            Or click to browse your files
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mb-6">
            Supports MP4, MOV, AVI up to 500MB
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            className="px-8"
          >
            Choose Video File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6 bg-card/50 rounded-2xl p-6">
          <div className="relative">
            <video
              src={videoPreview || ""}
              controls
              className="w-full max-h-64 rounded-xl bg-black"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 bg-background/80 hover:bg-background"
              onClick={removeVideo}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
            <Video className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{selectedVideo.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedVideo.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>

          <Button onClick={handleUpload} className="w-full" size="lg">
            Continue to Email Verification
          </Button>
        </div>
      )}
    </div>
  );
};