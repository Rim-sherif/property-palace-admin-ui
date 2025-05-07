
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";
import { Image, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onChange: (files: File[]) => void;
  value?: File[];
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onChange,
  value = [],
  maxFiles = 5,
  maxSize = 5, // 5MB
  accept = "image/*",
  disabled = false,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(value);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${maxFiles} files`,
        variant: "destructive"
      });
      return;
    }
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the ${maxSize}MB size limit`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      // Simulate upload progress
      setUploading(true);
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          const newFiles = [...files, ...validFiles];
          setFiles(newFiles);
          onChange(newFiles);
          
          toast({
            title: "Files uploaded",
            description: `${validFiles.length} file(s) uploaded successfully`,
          });
        }
      }, 200);
    }
    
    // Reset file input
    e.target.value = '';
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onChange(newFiles);
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`}
            className="relative border rounded-md p-2 group"
          >
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
              {file.type.startsWith('image/') ? (
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-sm mt-2 truncate">{file.name}</p>
            <Button 
              type="button" 
              size="icon" 
              variant="destructive" 
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2 progress-bar-animated" />
          <p className="text-sm text-muted-foreground">Uploading {progress}%</p>
        </div>
      )}
      
      {files.length < maxFiles && (
        <div>
          <input
            type="file"
            id="file-upload"
            className="sr-only"
            onChange={handleFileChange}
            accept={accept}
            multiple={maxFiles > 1}
            disabled={disabled || uploading}
          />
          <label
            htmlFor="file-upload"
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/30",
              (disabled || uploading) ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept.replaceAll(",", ", ")} (Max: {maxSize}MB)
              </p>
            </div>
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            {files.length} of {maxFiles} files uploaded
          </p>
        </div>
      )}
    </div>
  );
}
