
import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { Image, X } from "lucide-react";

interface Property {
  id: string;
  title: string;
}

interface PropertyImage {
  id: string;
  propertyId: string;
  propertyName: string;
  imageUrl: string;
  caption: string;
  isPrimary: boolean;
  uploadedAt: string;
}

const properties: Property[] = [
  { id: "1", title: "Luxury Ocean View Apartment" },
  { id: "2", title: "Modern Downtown Studio" },
];

const initialImages: PropertyImage[] = [
  {
    id: "1",
    propertyId: "1",
    propertyName: "Luxury Ocean View Apartment",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    caption: "Living Room with Ocean View",
    isPrimary: true,
    uploadedAt: "2023-08-15"
  },
  {
    id: "2",
    propertyId: "1",
    propertyName: "Luxury Ocean View Apartment",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGtpdGNoZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    caption: "Modern Kitchen",
    isPrimary: false,
    uploadedAt: "2023-08-15"
  }
];

const ImagesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [images, setImages] = useState<PropertyImage[]>(initialImages);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    propertyId: "",
    caption: "",
    isPrimary: false,
  });
  
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProperty = properties.find(p => p.id === formData.propertyId);
    if (!selectedProperty || files.length === 0) return;
    
    // In a real app, you would upload the files to a server and get URLs back
    // For this demo, we'll create object URLs for the files
    const newImages = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString().slice(2, 8),
      propertyId: formData.propertyId,
      propertyName: selectedProperty.title,
      imageUrl: URL.createObjectURL(file),
      caption: formData.caption,
      isPrimary: formData.isPrimary,
      uploadedAt: new Date().toISOString().split('T')[0]
    }));
    
    setImages((prev) => [...prev, ...newImages]);
    setFormData({
      propertyId: "",
      caption: "",
      isPrimary: false
    });
    setFiles([]);
    
    setIsDialogOpen(false);
    
    toast({
      title: "Images Uploaded",
      description: `${newImages.length} image(s) have been uploaded successfully`
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    
    toast({
      title: "Image Removed",
      description: "The image has been removed successfully"
    });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Property Images"
        description="Manage images for your properties"
        action={{
          label: "Upload Images",
          onClick: () => setIsDialogOpen(true)
        }}
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={image.imageUrl}
                alt={image.caption}
                className="object-cover w-full h-full"
              />
              {image.isPrimary && (
                <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Primary
                </span>
              )}
            </div>
            <CardHeader className="p-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm">{image.caption}</CardTitle>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardFooter className="p-3 pt-0 text-xs text-muted-foreground">
              {image.propertyName}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Property Images</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="propertyId">Property</Label>
                <Select
                  value={formData.propertyId}
                  onValueChange={(value) => handleSelectChange("propertyId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property Images</Label>
                <FileUpload
                  onChange={handleFileChange}
                  value={files}
                  accept="image/*"
                  maxFiles={5}
                  maxSize={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  name="caption"
                  placeholder="Enter image caption"
                  value={formData.caption}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  name="isPrimary"
                  checked={formData.isPrimary}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="isPrimary">Set as primary image</Label>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={files.length === 0 || !formData.propertyId}
              >
                Upload Images
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ImagesPage;
