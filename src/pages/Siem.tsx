
import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const mockLogs = [
  { id: 1, timestamp: '2025-04-18T10:15:22Z', source: 'Firewall', level: 'WARNING', message: 'Multiple failed login attempts detected from IP 192.168.1.105' },
  { id: 2, timestamp: '2025-04-18T10:12:56Z', source: 'IDS', level: 'CRITICAL', message: 'Possible SQL injection attempt detected' },
  { id: 3, timestamp: '2025-04-18T10:08:43Z', source: 'Authentication', level: 'INFO', message: 'User admin logged in successfully' },
  { id: 4, timestamp: '2025-04-18T10:05:12Z', source: 'Endpoint', level: 'ERROR', message: 'Antivirus update failed on host WS-2025' },
  { id: 5, timestamp: '2025-04-18T09:58:31Z', source: 'Network', level: 'WARNING', message: 'Unusual outbound traffic detected to IP 203.0.113.25' },
  { id: 6, timestamp: '2025-04-18T09:52:18Z', source: 'Database', level: 'INFO', message: 'Scheduled backup completed successfully' },
  { id: 7, timestamp: '2025-04-18T09:47:05Z', source: 'Firewall', level: 'ERROR', message: 'Rule update failed, reverting to previous configuration' },
  { id: 8, timestamp: '2025-04-18T09:42:59Z', source: 'IDS', level: 'CRITICAL', message: 'Potential data exfiltration detected from host WS-2028' },
  { id: 9, timestamp: '2025-04-18T09:38:22Z', source: 'Authentication', level: 'WARNING', message: 'Password policy violation during password reset' },
  { id: 10, timestamp: '2025-04-18T09:35:17Z', source: 'Endpoint', level: 'INFO', message: 'Software update successfully applied to 24 hosts' },
];

const mockAlerts = [
  { id: 1, timestamp: '2025-04-18T10:12:56Z', title: 'SQL Injection Attempt', severity: 'High', status: 'Open', source: 'Web Application Firewall' },
  { id: 2, timestamp: '2025-04-18T09:42:59Z', title: 'Data Exfiltration', severity: 'Critical', status: 'Investigating', source: 'Data Loss Prevention' },
  { id: 3, timestamp: '2025-04-18T09:58:31Z', title: 'Suspicious Outbound Connection', severity: 'Medium', status: 'Open', source: 'Network Monitor' },
  { id: 4, timestamp: '2025-04-18T10:15:22Z', title: 'Brute Force Attempt', severity: 'Medium', status: 'Open', source: 'Authentication Service' },
  { id: 5, timestamp: '2025-04-18T08:22:14Z', title: 'Malware Detection', severity: 'High', status: 'Contained', source: 'Endpoint Protection' },
];

const mockQueries = [
  { id: 1, name: 'Failed Login Attempts', description: 'Shows all failed login attempts in the last 24 hours', query: 'source="Authentication" level="ERROR" message="*login*failed*" | sort by timestamp' },
  { id: 2, name: 'Critical Alerts', description: 'Shows all critical level alerts from all sources', query: 'level="CRITICAL" | sort by timestamp' },
  { id: 3, name: 'Firewall Blocks', description: 'Shows all traffic blocked by the firewall', query: 'source="Firewall" message="*blocked*" | sort by timestamp' },
  { id: 4, name: 'Endpoint Issues', description: 'Shows all endpoint-related issues', query: 'source="Endpoint" level IN ("ERROR", "WARNING", "CRITICAL") | sort by timestamp' },
];

const Siem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [logLevel, setLogLevel] = useState(['INFO', 'WARNING', 'ERROR', 'CRITICAL']);

  // Filter logs based on search query and selected log levels
  const filteredLogs = mockLogs.filter(log => 
    (log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
     log.source.toLowerCase().includes(searchQuery.toLowerCase())) &&
    logLevel.includes(log.level)
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Terminal className="mr-2 h-8 w-8" />
          Security Information and Event Management
        </h1>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="query">Query Builder</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Event Logs</CardTitle>
              <CardDescription>
                Security events from all integrated systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input 
                  placeholder="Search logs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <div>
                  <ToggleGroup type="multiple" variant="outline" defaultValue={['INFO', 'WARNING', 'ERROR', 'CRITICAL']} onValueChange={(value) => setLogLevel(value)}>
                    <ToggleGroupItem value="INFO" className="px-3">Info</ToggleGroupItem>
                    <ToggleGroupItem value="WARNING" className="px-3">Warning</ToggleGroupItem>
                    <ToggleGroupItem value="ERROR" className="px-3">Error</ToggleGroupItem>
                    <ToggleGroupItem value="CRITICAL" className="px-3">Critical</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead className="w-[120px]">Source</TableHead>
                      <TableHead className="w-[100px]">Level</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.source}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.level === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            log.level === 'ERROR' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {log.level}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {mockLogs.length} logs
              </div>
              <Button variant="outline">Export Logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>
                Critical security alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead>Alert</TableHead>
                      <TableHead className="w-[120px]">Severity</TableHead>
                      <TableHead className="w-[150px]">Status</TableHead>
                      <TableHead className="w-[180px]">Source</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(alert.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{alert.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.severity === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            alert.severity === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {alert.severity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.status === 'Open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            alert.status === 'Investigating' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            alert.status === 'Contained' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}>
                            {alert.status}
                          </span>
                        </TableCell>
                        <TableCell>{alert.source}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Investigate</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query">
          <Card>
            <CardHeader>
              <CardTitle>SIEM Query</CardTitle>
              <CardDescription>
                Run custom queries against your security data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Query</label>
                <div className="rounded-md border bg-muted p-4 font-mono text-sm">
                  <textarea 
                    className="w-full bg-transparent outline-none resize-y min-h-[100px]"
                    placeholder="source=firewall level=ERROR | sort by timestamp"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save Query</Button>
                <Button>Run Query</Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Saved Queries</h3>
                <div className="space-y-2">
                  {mockQueries.map((q) => (
                    <Card key={q.id} className="p-0">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">{q.name}</CardTitle>
                        <CardDescription>{q.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <code className="text-xs bg-muted p-2 rounded block">{q.query}</code>
                      </CardContent>
                      <CardFooter className="p-2 pt-0 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setQueryInput(q.query)}>
                          Load
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboards">
          <Card>
            <CardHeader>
              <CardTitle>SIEM Dashboards</CardTitle>
              <CardDescription>
                Visualize security data with customizable dashboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Dashboard Builder</h3>
                <p className="text-muted-foreground mb-4">Create custom dashboards to visualize your security data</p>
                <Button>Create New Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Siem;
