
import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Pencil, X } from "lucide-react";

interface Developer {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
}

const initialDevelopers = [
  {
    id: "1",
    name: "Skyline Developers",
    email: "contact@skyline.dev",
    phone: "123-456-7890",
    description: "Luxury residential property developer with over 20 years of experience"
  },
  {
    id: "2",
    name: "Urban Constructions",
    email: "info@urbanconstructions.com",
    phone: "987-654-3210",
    description: "Specializing in modern urban developments and commercial properties"
  }
];

const DevelopersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: ""
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDeveloper = {
      id: Date.now().toString(),
      ...formData
    };
    
    setDevelopers((prev) => [...prev, newDeveloper]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      description: ""
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Developer Added",
      description: "The developer has been added successfully"
    });
  };

  const removeDeveloper = (id: string) => {
    setDevelopers((prev) => prev.filter((dev) => dev.id !== id));
    
    toast({
      title: "Developer Removed",
      description: "The developer has been removed successfully"
    });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Developers"
        description="Manage property developers in your system"
        action={{
          label: "Add Developer",
          onClick: () => setIsDialogOpen(true)
        }}
      />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {developers.map((dev) => (
          <Card key={dev.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {dev.name}
                </CardTitle>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeDeveloper(dev.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{dev.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{dev.phone}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {dev.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Developer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Developer Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter developer name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter developer description"
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
              <Button type="submit">Add Developer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default DevelopersPage;
