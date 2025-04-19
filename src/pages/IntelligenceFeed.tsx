
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, RefreshCw, Newspaper, Database, AlertTriangle, ExternalLink, Eye } from "lucide-react";

type FeedItem = {
  id: string;
  title: string;
  source: string;
  type: string;
  publishedAt: string;
  summary: string;
  url: string;
  tags: string[];
  severity: 'high' | 'medium' | 'low' | 'info';
  confidence: number;
};

const mockFeedItems: FeedItem[] = [
  {
    id: "FEED-001",
    title: "New Ransomware Variant Targeting Financial Institutions",
    source: "DarkReading",
    type: "threat_report",
    publishedAt: "2025-04-18T09:15:00Z",
    summary: "A new ransomware variant called 'BlackFinance' has been observed targeting financial institutions worldwide. The malware uses sophisticated evasion techniques and encrypts files with a strong algorithm.",
    url: "https://example.com/article1",
    tags: ["ransomware", "financial", "encryption"],
    severity: "high",
    confidence: 85,
  },
  {
    id: "FEED-002",
    title: "Critical Vulnerability in Popular VPN Software",
    source: "CVE Database",
    type: "vulnerability",
    publishedAt: "2025-04-17T14:30:00Z",
    summary: "A critical authentication bypass vulnerability (CVE-2025-1234) has been discovered in PopularVPN software versions 4.2.x through 5.1.x. Remote attackers can gain unauthorized access to protected networks.",
    url: "https://example.com/article2",
    tags: ["vulnerability", "vpn", "authentication"],
    severity: "high",
    confidence: 95,
  },
  {
    id: "FEED-003",
    title: "APT Group Targeting Energy Sector with Spear Phishing Campaign",
    source: "Mandiant",
    type: "threat_actor",
    publishedAt: "2025-04-16T11:45:00Z",
    summary: "An APT group known as 'Voltage' has been observed conducting a targeted spear phishing campaign against energy sector companies. The emails contain malicious attachments that deploy a custom backdoor.",
    url: "https://example.com/article3",
    tags: ["apt", "phishing", "energy", "backdoor"],
    severity: "medium",
    confidence: 80,
  },
  {
    id: "FEED-004",
    title: "New IOCs Released for Recent Banking Trojan Campaign",
    source: "AlienVault OTX",
    type: "indicators",
    publishedAt: "2025-04-15T16:20:00Z",
    summary: "New indicators of compromise have been released for the 'MoneyGrab' banking trojan campaign. The IOCs include C2 server IPs, file hashes, and domain names associated with the campaign.",
    url: "https://example.com/article4",
    tags: ["ioc", "banking", "trojan", "malware"],
    severity: "medium",
    confidence: 75,
  },
  {
    id: "FEED-005",
    title: "Zero-Day Vulnerability in Windows OS Being Actively Exploited",
    source: "Microsoft Security",
    type: "vulnerability",
    publishedAt: "2025-04-14T08:10:00Z",
    summary: "Microsoft has confirmed a zero-day vulnerability (CVE-2025-5678) affecting Windows 10 and 11 that is being actively exploited in the wild. The vulnerability allows privilege escalation and remote code execution.",
    url: "https://example.com/article5",
    tags: ["zero-day", "windows", "exploit", "rce"],
    severity: "high",
    confidence: 90,
  },
  {
    id: "FEED-006",
    title: "DDoS Attack Techniques and Mitigation Strategies",
    source: "Cloudflare Blog",
    type: "analysis",
    publishedAt: "2025-04-13T13:55:00Z",
    summary: "A comprehensive analysis of recent DDoS attack techniques and effective mitigation strategies. The report covers amplification attacks, botnets, and layer 7 attacks with real-world case studies.",
    url: "https://example.com/article6",
    tags: ["ddos", "mitigation", "botnet", "analysis"],
    severity: "info",
    confidence: 70,
  },
  {
    id: "FEED-007",
    title: "New Malware Campaign Exploiting Unpatched Java Applications",
    source: "VirusTotal",
    type: "malware",
    publishedAt: "2025-04-12T10:40:00Z",
    summary: "A new malware campaign targeting unpatched Java applications has been observed in the wild. The attackers exploit CVE-2023-9876 to deploy cryptocurrency miners and credential stealers.",
    url: "https://example.com/article7",
    tags: ["java", "malware", "crypto", "exploit"],
    severity: "medium",
    confidence: 85,
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

const getSeverityBadge = (severity: FeedItem['severity']) => {
  const severityStyles = {
    high: "bg-threat-high/15 text-threat-high border-threat-high hover:bg-threat-high/20",
    medium: "bg-threat-warning/15 text-threat-warning border-threat-warning hover:bg-threat-warning/20",
    low: "bg-threat-low/15 text-threat-low border-threat-low hover:bg-threat-low/20",
    info: "bg-threat-info/15 text-threat-info border-threat-info hover:bg-threat-info/20",
  };
  
  return (
    <Badge variant="outline" className={severityStyles[severity]}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

const IntelligenceFeed = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  
  // Get unique sources for filter dropdown
  const sources = Array.from(new Set(mockFeedItems.map(item => item.source)));
  
  // Filter feed items based on active filters
  const filteredFeedItems = mockFeedItems.filter(item => {
    // Filter by tab (feed type)
    if (activeTab !== "all" && item.type !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.summary.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by source
    if (selectedSource !== "all" && item.source !== selectedSource) {
      return false;
    }
    
    // Filter by severity
    if (selectedSeverity !== "all" && item.severity !== selectedSeverity) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Intelligence Feed</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Newspaper className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Threat Intelligence Feed</CardTitle>
          <CardDescription>
            Latest threat intelligence from various sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-grow">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <Input
                  id="search"
                  placeholder="Search intelligence feed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="source" className="sr-only">Source</Label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger id="source">
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sources</SelectItem>
                    {sources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="severity" className="sr-only">Severity</Label>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="All severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="threat_report">Threat Reports</TabsTrigger>
                <TabsTrigger value="vulnerability">Vulnerabilities</TabsTrigger>
                <TabsTrigger value="threat_actor">Threat Actors</TabsTrigger>
                <TabsTrigger value="indicators">Indicators</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Feed items */}
            <div className="mt-6">
              <Table>
                <TableCaption>Intelligence feed contains {filteredFeedItems.length} items</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                        <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {item.summary}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell>{formatDate(item.publishedAt)}</TableCell>
                      <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                      <TableCell>{item.confidence}%</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Open</span>
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligenceFeed;
