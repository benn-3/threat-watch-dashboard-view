
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Building, User, Server, Wifi, Shield } from "lucide-react";

// Mock data types
type EntityType = "user" | "device" | "network" | "organization" | "asset";

interface Entity {
  id: string;
  name: string;
  type: EntityType;
  category: string;
  riskScore: number;
  lastActivity: string;
  status: "active" | "inactive" | "suspicious";
}

// Mock data
const mockEntities: Entity[] = [
  {
    id: "USR-001",
    name: "John Smith",
    type: "user",
    category: "Administrator",
    riskScore: 12,
    lastActivity: "2025-04-18T08:30:00Z",
    status: "active"
  },
  {
    id: "USR-002",
    name: "Emma Johnson",
    type: "user",
    category: "Security Analyst",
    riskScore: 5,
    lastActivity: "2025-04-17T16:45:00Z",
    status: "active"
  },
  {
    id: "DEV-001",
    name: "Windows Workstation 1",
    type: "device",
    category: "Workstation",
    riskScore: 28,
    lastActivity: "2025-04-18T10:15:00Z",
    status: "suspicious"
  },
  {
    id: "DEV-002",
    name: "Linux Server 3",
    type: "device",
    category: "Server",
    riskScore: 8,
    lastActivity: "2025-04-17T22:10:00Z",
    status: "active"
  },
  {
    id: "NET-001",
    name: "Corporate LAN",
    type: "network",
    category: "Internal Network",
    riskScore: 15,
    lastActivity: "2025-04-18T09:20:00Z",
    status: "active"
  },
  {
    id: "ORG-001",
    name: "IT Department",
    type: "organization",
    category: "Internal",
    riskScore: 7,
    lastActivity: "2025-04-16T14:30:00Z",
    status: "active"
  },
  {
    id: "AST-001",
    name: "Database Server",
    type: "asset",
    category: "Critical Infrastructure",
    riskScore: 32,
    lastActivity: "2025-04-18T05:40:00Z",
    status: "active"
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getEntityIcon = (type: EntityType) => {
  switch (type) {
    case 'user':
      return <User className="h-4 w-4" />;
    case 'device':
      return <Server className="h-4 w-4" />;
    case 'network':
      return <Wifi className="h-4 w-4" />;
    case 'organization':
      return <Building className="h-4 w-4" />;
    case 'asset':
      return <Shield className="h-4 w-4" />;
    default:
      return null;
  }
};

const Entities = () => {
  const [entities] = useState<Entity[]>(mockEntities);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntities = searchTerm
    ? entities.filter(entity => 
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : entities;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Entities</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Entity
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search entities..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entity Management</CardTitle>
          <CardDescription>
            Manage and monitor all entities in your security environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Entities</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="networks">Networks</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <EntityTable entities={filteredEntities} />
            </TabsContent>
            
            <TabsContent value="users">
              <EntityTable entities={filteredEntities.filter(e => e.type === 'user')} />
            </TabsContent>
            
            <TabsContent value="devices">
              <EntityTable entities={filteredEntities.filter(e => e.type === 'device')} />
            </TabsContent>
            
            <TabsContent value="networks">
              <EntityTable entities={filteredEntities.filter(e => e.type === 'network')} />
            </TabsContent>
            
            <TabsContent value="organizations">
              <EntityTable entities={filteredEntities.filter(e => e.type === 'organization')} />
            </TabsContent>
            
            <TabsContent value="assets">
              <EntityTable entities={filteredEntities.filter(e => e.type === 'asset')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Extracted entity table component for reuse
const EntityTable = ({ entities }: { entities: Entity[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Risk Score</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entities.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
              No entities found
            </TableCell>
          </TableRow>
        ) : (
          entities.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell className="font-medium">{entity.id}</TableCell>
              <TableCell className="flex items-center gap-1.5">
                {getEntityIcon(entity.type)}
                {entity.name}
              </TableCell>
              <TableCell className="capitalize">{entity.type}</TableCell>
              <TableCell>{entity.category}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      entity.riskScore > 25 
                        ? 'bg-red-500' 
                        : entity.riskScore > 15 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                  />
                  {entity.riskScore}
                </div>
              </TableCell>
              <TableCell>{formatDate(entity.lastActivity)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  entity.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : entity.status === 'inactive' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {entity.status.charAt(0).toUpperCase() + entity.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default Entities;
