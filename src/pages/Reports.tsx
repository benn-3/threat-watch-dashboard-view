
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Download, Filter, FileText, RefreshCw } from "lucide-react";

type Report = {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  status: "completed" | "pending" | "failed";
  size: string;
};

const mockReports: Report[] = [
  {
    id: "REP-001",
    title: "Monthly Security Summary",
    type: "Security Overview",
    createdAt: "2025-04-15T10:30:00Z",
    status: "completed",
    size: "2.4 MB"
  },
  {
    id: "REP-002",
    title: "Threat Intelligence Analysis",
    type: "Threat Intelligence",
    createdAt: "2025-04-14T16:45:00Z",
    status: "completed",
    size: "4.1 MB"
  },
  {
    id: "REP-003",
    title: "Network Traffic Analysis",
    type: "Network Activity",
    createdAt: "2025-04-13T09:15:00Z",
    status: "completed",
    size: "3.7 MB"
  },
  {
    id: "REP-004",
    title: "Vulnerability Assessment Report",
    type: "Vulnerability Scan",
    createdAt: "2025-04-12T14:20:00Z",
    status: "completed",
    size: "5.2 MB"
  },
  {
    id: "REP-005",
    title: "User Activity Audit",
    type: "User Audit",
    createdAt: "2025-04-11T11:10:00Z",
    status: "pending",
    size: "1.8 MB"
  },
  {
    id: "REP-006",
    title: "Compliance Status Report",
    type: "Compliance",
    createdAt: "2025-04-10T13:25:00Z",
    status: "failed",
    size: "3.3 MB"
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

const Reports = () => {
  const [reports] = useState<Report[]>(mockReports);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            View and download security reports and analysis documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of available security reports</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : report.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={report.status !== 'completed'}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
