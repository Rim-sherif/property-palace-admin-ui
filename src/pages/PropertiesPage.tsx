
import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building, MapPin, Home, Table, X } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  projectId: string;
  projectName: string;
  address: string;
  status: "Available" | "Reserved" | "Sold";
  imageUrl?: string;
}

const projects: Project[] = [
  { id: "1", name: "Seaside Heights" },
  { id: "2", name: "Downtown Plaza" },
];

const initialProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Ocean View Apartment",
    description: "Spacious apartment with stunning ocean views and modern finishes",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    price: 850000,
    projectId: "1",
    projectName: "Seaside Heights",
    address: "123 Coastal Drive, Miami, FL",
    status: "Available",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "2",
    title: "Modern Downtown Studio",
    description: "Contemporary studio apartment in the heart of downtown",
    propertyType: "Studio",
    bedrooms: 0,
    bathrooms: 1,
    area: 650,
    price: 425000,
    projectId: "2",
    projectName: "Downtown Plaza",
    address: "456 Urban Street, New York, NY",
    status: "Reserved",
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  }
];

const PropertiesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    price: 0,
    projectId: "",
    address: "",
    status: "Available" as const,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  });
  
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "bedrooms" || name === "bathrooms" || name === "area" || name === "price"
        ? parseFloat(value)
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProject = projects.find(p => p.id === formData.projectId);
    if (!selectedProject) return;
    
    const newProperty = {
      id: Date.now().toString(),
      ...formData,
      projectName: selectedProject.name
    };
    
    setProperties((prev) => [...prev, newProperty]);
    setFormData({
      title: "",
      description: "",
      propertyType: "",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      price: 0,
      projectId: "",
      address: "",
      status: "Available",
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Property Added",
      description: "The property has been added successfully"
    });
  };

  const removeProperty = (id: string) => {
    setProperties((prev) => prev.filter((prop) => prop.id !== id));
    
    toast({
      title: "Property Removed",
      description: "The property has been removed successfully"
    });
  };

  const getStatusColor = (status: Property["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "Reserved":
        return "bg-amber-100 text-amber-700";
      case "Sold":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Properties"
        description="Manage real estate properties in your projects"
        action={{
          label: "Add Property",
          onClick: () => setIsDialogOpen(true)
        }}
      />

      <div className="mb-6">
        <Tabs value={view} onValueChange={(v) => setView(v as "cards" | "table")} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Card View
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Table View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="cards" className="mt-0">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              {property.imageUrl && (
                <div className="aspect-[16/9] relative">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="object-cover w-full h-full"
                  />
                  <span 
                    className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${getStatusColor(property.status)}`}
                  >
                    {property.status}
                  </span>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeProperty(property.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.projectName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.address}</span>
                </div>
                <div className="flex gap-4 text-sm mt-2">
                  <div>
                    <span className="font-bold">{property.bedrooms}</span> Beds
                  </div>
                  <div>
                    <span className="font-bold">{property.bathrooms}</span> Baths
                  </div>
                  <div>
                    <span className="font-bold">{property.area}</span> sqft
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {property.description}
                </p>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="text-lg font-bold">
                  ${property.price.toLocaleString()}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="table" className="mt-0">
        <div className="border rounded-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3">Property</th>
                  <th className="text-left p-3">Project</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Beds</th>
                  <th className="text-left p-3">Baths</th>
                  <th className="text-left p-3">Area</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, index) => (
                  <tr key={property.id} className={index % 2 ? "bg-muted/30" : ""}>
                    <td className="p-3">
                      <div className="font-medium">{property.title}</div>
                    </td>
                    <td className="p-3">{property.projectName}</td>
                    <td className="p-3">{property.propertyType}</td>
                    <td className="p-3">{property.bedrooms}</td>
                    <td className="p-3">{property.bathrooms}</td>
                    <td className="p-3">{property.area} sqft</td>
                    <td className="p-3">${property.price.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeProperty(property.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter property title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectId">Project</Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) => handleSelectChange("projectId", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((proj) => (
                        <SelectItem key={proj.id} value={proj.id}>
                          {proj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleSelectChange("propertyType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter property address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sqft)</Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value as any)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter property description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="Enter image URL"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Property</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PropertiesPage;
