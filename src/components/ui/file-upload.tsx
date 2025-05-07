
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
  onChange?: (files: File[]) => void; // Added for multi-file support
  value?: File[]; // Added for controlled component support
  label?: string;
  buttonLabel?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  maxFiles?: number; // Added for multi-file support
  multiple?: boolean; // Added for multi-file support
}

export function FileUpload({
  accept = "image/*",
  maxSize = 5, // Default max size 5MB
  onFileSelect,
  onChange,
  value,
  label = "Upload file",
  buttonLabel = "Select file",
  description,
  className,
  disabled = false,
  maxFiles = 1,
  multiple = false,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(value || []);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Check file size
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Check max files limit for multiple selection
    if (multiple && files.length + (value?.length || 0) > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} files`);
      return;
    }

    setError(null);
    
    if (multiple) {
      const newFiles = [...selectedFiles, ...files].slice(0, maxFiles);
      setSelectedFiles(newFiles);
      if (onChange) onChange(newFiles);
    } else {
      setSelectedFiles([files[0]]);
      if (onFileSelect) onFileSelect(files[0]);
      if (onChange) onChange([files[0]]);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  // Format file name for display
  const formatFileName = (name: string) => {
    if (name.length <= 20) return name;
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
          multiple={multiple}
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
        
        {selectedFiles.length > 0 && (
          <div className="text-sm font-medium space-y-1">
            {selectedFiles.map((file, index) => (
              <div key={index}>Selected: {formatFileName(file.name)}</div>
            ))}
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
