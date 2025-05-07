
import React, { useState, useRef } from "react";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect?: (file: File) => void;
  label?: string;
  buttonLabel?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  accept = "image/*",
  maxSize = 5, // Default max size 5MB
  onFileSelect,
  label = "Upload file",
  buttonLabel = "Select file",
  description,
  className,
  disabled = false,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setError(null);
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  // Format file name for display
  const formatFileName = (name: string) => {
    if (name.length <= 20) return name;
    // Simple truncation without using replaceAll
    const extension = name.lastIndexOf(".") > 0 
      ? name.substring(name.lastIndexOf(".")) 
      : "";
    return name.substring(0, 15) + "..." + extension;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="file-upload">{label}</Label>
      
      <div className="flex flex-col gap-2">
        <Input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          className="flex items-center gap-2"
          disabled={disabled}
        >
          <Upload size={16} />
          {buttonLabel}
        </Button>
        
        {selectedFile && (
          <div className="text-sm font-medium">
            Selected: {formatFileName(selectedFile.name)}
          </div>
        )}
        
        {error && <div className="text-sm text-destructive">{error}</div>}
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
