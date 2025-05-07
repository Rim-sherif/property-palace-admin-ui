
import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { User, FolderPlus, Table, Image } from "lucide-react";

const statsData = [
  { title: "Developers", value: "12", icon: User, color: "bg-blue-100 text-blue-600" },
  { title: "Projects", value: "24", icon: FolderPlus, color: "bg-green-100 text-green-600" },
  { title: "Properties", value: "48", icon: Table, color: "bg-amber-100 text-amber-600" },
  { title: "Images", value: "96", icon: Image, color: "bg-purple-100 text-purple-600" },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <PageHeader 
        title="Dashboard" 
        description="Welcome to Property Palace Admin Panel" 
      />
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                Total {stat.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-4 p-3 rounded-md border bg-card"
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Table className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">New Property Added</h4>
                    <p className="text-xs text-muted-foreground">
                      Luxury Apartment in Project Seaside Heights
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    2 hours ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
