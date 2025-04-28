
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Filter, RefreshCw, Search, Zap } from 'lucide-react';

// Mock intelligence feed data
const feedData = [
  {
    id: '1',
    name: 'AlienVault OTX',
    description: 'Open Threat Exchange intelligence feed',
    type: 'community',
    status: 'active',
    lastUpdated: '2023-04-28T14:30:00',
    indicators: 1243
  },
  {
    id: '2',
    name: 'MISP Feed',
    description: 'Malware Information Sharing Platform feed',
    type: 'open-source',
    status: 'active',
    lastUpdated: '2023-04-27T08:15:00',
    indicators: 876
  },
  {
    id: '3',
    name: 'Talos Intelligence',
    description: 'Cisco Talos threat intelligence',
    type: 'premium',
    status: 'active',
    lastUpdated: '2023-04-28T09:45:00',
    indicators: 542
  },
  {
    id: '4',
    name: 'PhishTank',
    description: 'Phishing URL database',
    type: 'community',
    status: 'active',
    lastUpdated: '2023-04-26T18:20:00',
    indicators: 967
  },
  {
    id: '5',
    name: 'Abuse.ch',
    description: 'Malware and botnet tracking',
    type: 'open-source',
    status: 'error',
    lastUpdated: '2023-04-20T11:10:00',
    indicators: 0
  },
  {
    id: '6',
    name: 'IBM X-Force Exchange',
    description: 'Commercial threat intelligence platform',
    type: 'premium',
    status: 'active',
    lastUpdated: '2023-04-28T07:30:00',
    indicators: 1892
  },
  {
    id: '7',
    name: 'SANS Internet Storm Center',
    description: 'DShield collaborative firewall log correlation',
    type: 'open-source',
    status: 'active',
    lastUpdated: '2023-04-27T16:45:00',
    indicators: 723
  },
  {
    id: '8',
    name: 'Custom Internal Feed',
    description: 'Organization specific intelligence',
    type: 'custom',
    status: 'paused',
    lastUpdated: '2023-04-15T10:00:00',
    indicators: 156
  }
];

// Mock recent indicators
const recentIndicators = [
  {
    id: '1',
    indicator: '185.229.224.32',
    type: 'ip',
    feed: 'AlienVault OTX',
    confidence: 87,
    added: '2023-04-28T14:30:00'
  },
  {
    id: '2',
    indicator: 'malicious-domain.com',
    type: 'domain',
    feed: 'IBM X-Force Exchange',
    confidence: 92,
    added: '2023-04-28T14:28:00'
  },
  {
    id: '3',
    indicator: 'hxxp://phishing-site.xyz/login.php',
    type: 'url',
    feed: 'PhishTank',
    confidence: 95,
    added: '2023-04-28T14:25:00'
  },
  {
    id: '4',
    indicator: 'e1ee9622b686062a9c3c9469d1683ce9a722e5dc',
    type: 'file_hash',
    feed: 'MISP Feed',
    confidence: 84,
    added: '2023-04-28T14:20:00'
  },
  {
    id: '5',
    indicator: '92.53.127.112',
    type: 'ip',
    feed: 'Talos Intelligence',
    confidence: 76,
    added: '2023-04-28T14:15:00'
  }
];

// Format date to readable string
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Status badge component
const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    paused: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return <Badge className={styles[status]}>{status}</Badge>;
};

// Type badge component
const TypeBadge = ({ type }) => {
  const styles = {
    'premium': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'community': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'open-source': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    'custom': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
  };

  return <Badge variant="secondary" className={styles[type]}>{type}</Badge>;
};

// Indicator type badge component
const IndicatorTypeBadge = ({ type }) => {
  const styles = {
    'ip': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'domain': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'url': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'file_hash': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    'email': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const labels = {
    'ip': 'IP',
    'domain': 'Domain',
    'url': 'URL',
    'file_hash': 'Hash',
    'email': 'Email'
  };

  return <Badge variant="secondary" className={styles[type]}>{labels[type]}</Badge>;
};

// Confidence badge component
const ConfidenceBadge = ({ confidence }) => {
  let bgColor;
  
  if (confidence >= 90) {
    bgColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  } else if (confidence >= 70) {
    bgColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  } else if (confidence >= 50) {
    bgColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
  } else {
    bgColor = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }

  return <Badge className={bgColor}>{confidence}%</Badge>;
};

const IntelligenceFeed = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Intelligence Feeds</h1>
        <p className="text-muted-foreground">
          Manage and configure threat intelligence feeds
        </p>
      </div>

      <Tabs defaultValue="feeds" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feeds">Feeds</TabsTrigger>
          <TabsTrigger value="indicators">Latest Indicators</TabsTrigger>
          <TabsTrigger value="settings">Feed Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feeds" className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Feeds
              </Button>
              <Button variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Add Feed
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Feed Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="open-source">Open Source</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle>Configured Feeds</CardTitle>
                <CardDescription>
                  {feedData.length} feeds configured
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <div className="flex items-center">
                        Feed Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Last Updated
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Indicators</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedData.map((feed) => (
                    <TableRow key={feed.id}>
                      <TableCell className="font-medium">
                        <div>
                          {feed.name}
                          <p className="text-sm text-muted-foreground">{feed.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={feed.type} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={feed.status} />
                      </TableCell>
                      <TableCell>{formatDate(feed.lastUpdated)}</TableCell>
                      <TableCell className="text-right">
                        {feed.indicators > 0 ? (
                          feed.indicators.toLocaleString()
                        ) : (
                          <span className="text-muted-foreground">No data</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicators" className="space-y-4">
          <div className="flex justify-between">
            <div className="w-full md:w-[400px] relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search indicators..."
                className="pl-8"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Indicator Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ip">IP Address</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="file_hash">File Hash</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Indicators</CardTitle>
                <CardDescription>
                  Latest threat intelligence
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Indicator</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Feed Source</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentIndicators.map((indicator) => (
                    <TableRow key={indicator.id}>
                      <TableCell className="font-medium font-mono">
                        {indicator.indicator}
                      </TableCell>
                      <TableCell>
                        <IndicatorTypeBadge type={indicator.type} />
                      </TableCell>
                      <TableCell>{indicator.feed}</TableCell>
                      <TableCell>
                        <ConfidenceBadge confidence={indicator.confidence} />
                      </TableCell>
                      <TableCell>{formatDate(indicator.added)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feed Configuration</CardTitle>
              <CardDescription>
                Configure global feed settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Feed settings panel will be implemented soon.</p>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligenceFeed;
