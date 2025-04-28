
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building, Plus, Search, Server, User, Users, Zap } from 'lucide-react';

// Mock entities data
const entities = [
  {
    id: '1',
    name: 'Corporate HQ',
    type: 'organization',
    assets: 342,
    users: 1200,
    riskScore: 28,
    vulnerabilities: 12,
    lastScan: '2023-04-20T14:30:00'
  },
  {
    id: '2',
    name: 'East Coast DC',
    type: 'datacenter',
    assets: 86,
    users: 15,
    riskScore: 42,
    vulnerabilities: 24,
    lastScan: '2023-04-22T10:15:00'
  },
  {
    id: '3',
    name: 'Marketing Department',
    type: 'department',
    assets: 64,
    users: 45,
    riskScore: 18,
    vulnerabilities: 7,
    lastScan: '2023-04-25T16:45:00'
  },
  {
    id: '4',
    name: 'Sales Team',
    type: 'department',
    assets: 58,
    users: 32,
    riskScore: 34,
    vulnerabilities: 15,
    lastScan: '2023-04-21T09:30:00'
  },
  {
    id: '5',
    name: 'West Coast Office',
    type: 'location',
    assets: 120,
    users: 85,
    riskScore: 22,
    vulnerabilities: 9,
    lastScan: '2023-04-23T11:20:00'
  },
  {
    id: '6',
    name: 'Cloud Infrastructure',
    type: 'infrastructure',
    assets: 205,
    users: 40,
    riskScore: 46,
    vulnerabilities: 31,
    lastScan: '2023-04-18T08:45:00'
  },
  {
    id: '7',
    name: 'Development Team',
    type: 'department',
    assets: 74,
    users: 28,
    riskScore: 37,
    vulnerabilities: 22,
    lastScan: '2023-04-24T15:10:00'
  },
  {
    id: '8',
    name: 'European Branch',
    type: 'organization',
    assets: 128,
    users: 92,
    riskScore: 25,
    vulnerabilities: 14,
    lastScan: '2023-04-19T12:30:00'
  }
];

// Format date to readable string
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(date);
};

// Entity type badge component
const EntityTypeBadge = ({ type }) => {
  const styles = {
    'organization': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'datacenter': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'department': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'location': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    'infrastructure': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  };

  return <Badge variant="secondary" className={styles[type]}>{type}</Badge>;
};

// Risk score badge component
const RiskScoreBadge = ({ score }) => {
  let bgColor;
  
  if (score <= 20) {
    bgColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  } else if (score <= 35) {
    bgColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
  } else {
    bgColor = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }

  return <Badge className={bgColor}>{score}</Badge>;
};

// Entity type icon component
const EntityTypeIcon = ({ type }) => {
  switch (type) {
    case 'organization':
      return <Building className="h-10 w-10 text-blue-600 dark:text-blue-400" />;
    case 'datacenter':
      return <Server className="h-10 w-10 text-purple-600 dark:text-purple-400" />;
    case 'department':
      return <Users className="h-10 w-10 text-amber-600 dark:text-amber-400" />;
    case 'location':
      return <Building className="h-10 w-10 text-teal-600 dark:text-teal-400" />;
    case 'infrastructure':
      return <Zap className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />;
    default:
      return <Building className="h-10 w-10 text-gray-600 dark:text-gray-400" />;
  }
};

// Entity card component
const EntityCard = ({ entity }) => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{entity.name}</CardTitle>
          <CardDescription className="mt-1 flex items-center">
            <EntityTypeBadge type={entity.type} />
          </CardDescription>
        </div>
        <EntityTypeIcon type={entity.type} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Assets</p>
            <p className="text-xl font-bold">{entity.assets}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Users</p>
            <p className="text-xl font-bold">{entity.users}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
            <p><RiskScoreBadge score={entity.riskScore} /></p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Vulnerabilities</p>
            <p className="text-xl font-bold">{entity.vulnerabilities}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">Last scanned: {formatDate(entity.lastScan)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Entities = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Entities</h1>
        <p className="text-muted-foreground">
          Manage organizations, departments and assets
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-auto flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search entities..."
            className="pl-8"
          />
        </div>
        
        <div className="w-full sm:w-auto flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Entity
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Entity Relationships</CardTitle>
          <CardDescription>
            Connections between entities in your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Entity</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Target Entity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Corporate HQ</TableCell>
                <TableCell>contains</TableCell>
                <TableCell>Marketing Department</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Corporate HQ</TableCell>
                <TableCell>contains</TableCell>
                <TableCell>Sales Team</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>European Branch</TableCell>
                <TableCell>reports to</TableCell>
                <TableCell>Corporate HQ</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cloud Infrastructure</TableCell>
                <TableCell>supports</TableCell>
                <TableCell>Corporate HQ</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Development Team</TableCell>
                <TableCell>manages</TableCell>
                <TableCell>Cloud Infrastructure</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Entities;
