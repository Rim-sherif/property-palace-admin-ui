
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
import { useToast } from "@/hooks/use-toast";
import { Building, MapPin, FolderPlus, User, Calendar, X } from "lucide-react";

interface Developer {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  developerId: string;
  developerName: string;
  startDate: string;
  status: "Planning" | "In Progress" | "Completed";
}

const developers: Developer[] = [
  { id: "1", name: "Skyline Developers" },
  { id: "2", name: "Urban Constructions" },
];

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Seaside Heights",
    location: "Miami, Florida",
    description: "Luxury beachfront apartments with premium amenities",
    developerId: "1",
    developerName: "Skyline Developers",
    startDate: "2023-06-15",
    status: "In Progress"
  },
  {
    id: "2",
    name: "Downtown Plaza",
    location: "New York, NY",
    description: "Mixed-use development with retail and residential units",
    developerId: "2",
    developerName: "Urban Constructions",
    startDate: "2022-11-03",
    status: "Planning"
  }
];

const ProjectsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    developerId: "",
    startDate: "",
    status: "Planning" as const
  });
  
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
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
    
    const selectedDeveloper = developers.find(d => d.id === formData.developerId);
    if (!selectedDeveloper) return;
    
    const newProject = {
      id: Date.now().toString(),
      ...formData,
      developerName: selectedDeveloper.name
    };
    
    setProjects((prev) => [...prev, newProject]);
    setFormData({
      name: "",
      location: "",
      description: "",
      developerId: "",
      startDate: "",
      status: "Planning"
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Project Added",
      description: "The project has been added successfully"
    });
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
    
    toast({
      title: "Project Removed",
      description: "The project has been removed successfully"
    });
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Planning":
        return "bg-amber-100 text-amber-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Projects"
        description="Manage real estate development projects"
        action={{
          label: "Add Project",
          onClick: () => setIsDialogOpen(true)
        }}
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {project.name}
                </CardTitle>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeProject(project.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.developerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Started: {project.startDate}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </CardContent>
            <CardFooter className="border-t p-4 bg-muted/10">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter project location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="developerId">Developer</Label>
                <Select
                  value={formData.developerId}
                  onValueChange={(value) => handleSelectChange("developerId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a developer" />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map((dev) => (
                      <SelectItem key={dev.id} value={dev.id}>
                        {dev.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
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
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter project description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProjectsPage;
