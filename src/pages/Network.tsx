
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Server, Wifi, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock network data
const mockNetworkNodes = [
  { id: 1, name: "Main Gateway", type: "gateway", status: "online", ip: "192.168.1.1", threats: 0 },
  { id: 2, name: "Primary Server", type: "server", status: "online", ip: "192.168.1.10", threats: 2 },
  { id: 3, name: "Finance Department", type: "subnet", status: "online", ip: "192.168.2.0/24", threats: 1 },
  { id: 4, name: "Marketing Department", type: "subnet", status: "online", ip: "192.168.3.0/24", threats: 0 },
  { id: 5, name: "Development Servers", type: "server", status: "degraded", ip: "192.168.1.20", threats: 3 },
  { id: 6, name: "Cloud Gateway", type: "gateway", status: "offline", ip: "203.0.113.1", threats: 0 },
  { id: 7, name: "Executive Network", type: "subnet", status: "online", ip: "192.168.4.0/24", threats: 0 },
  { id: 8, name: "Public Webserver", type: "server", status: "online", ip: "203.0.113.10", threats: 5 },
];

// Mock connections between nodes
const mockConnections = [
  { source: 1, target: 2 },
  { source: 1, target: 3 },
  { source: 1, target: 4 },
  { source: 1, target: 5 },
  { source: 2, target: 7 },
  { source: 6, target: 8 },
];

const Network = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [networkNodes, setNetworkNodes] = useState(mockNetworkNodes);
  const [selectedNode, setSelectedNode] = useState<typeof mockNetworkNodes[0] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading network data
    const timer = setTimeout(() => {
      toast({
        title: "Network Data Loaded",
        description: "Successfully loaded network topology data",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredNodes = networkNodes.filter(node => 
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'gateway':
        return <Globe className="h-5 w-5" />;
      case 'server':
        return <Server className="h-5 w-5" />;
      case 'subnet':
        return <Wifi className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string, threats: number) => {
    if (threats > 0) {
      return <Badge variant="destructive" className="ml-2 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {threats} {threats === 1 ? 'threat' : 'threats'}
      </Badge>;
    }

    switch (status) {
      case 'online':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 ml-2">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 ml-2">Offline</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 ml-2">Degraded</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">Unknown</Badge>;
    }
  };

  const scanNetwork = () => {
    toast({
      title: "Network Scan Initiated",
      description: "Scanning network for threats and vulnerabilities",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Network Topology</h1>
          <p className="text-muted-foreground">
            Monitor and analyze your network infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={scanNetwork} className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Scan Network
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Network Assets</CardTitle>
            <CardDescription>View and filter network devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search network..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {filteredNodes.map(node => (
                <div 
                  key={node.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-accent/50 ${selectedNode?.id === node.id ? 'bg-accent' : ''}`}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="mr-2">
                    {getNodeIcon(node.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{node.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{node.ip}</div>
                  </div>
                  {getStatusBadge(node.status, node.threats)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          {selectedNode ? (
            <Tabs defaultValue="overview">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {getNodeIcon(selectedNode.type)}
                      <span className="ml-2">{selectedNode.name}</span>
                      {getStatusBadge(selectedNode.status, selectedNode.threats)}
                    </CardTitle>
                    <CardDescription>IP: {selectedNode.ip}</CardDescription>
                  </div>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="traffic">Traffic</TabsTrigger>
                    <TabsTrigger value="threats">Threats</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold capitalize">{selectedNode.status}</div>
                        <p className="text-xs text-muted-foreground">Last updated: 2 minutes ago</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Connections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {mockConnections.filter(c => c.source === selectedNode.id || c.target === selectedNode.id).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Active network connections</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {mockConnections
                          .filter(c => c.source === selectedNode.id || c.target === selectedNode.id)
                          .map(connection => {
                            const connectedNodeId = connection.source === selectedNode.id ? connection.target : connection.source;
                            const connectedNode = networkNodes.find(n => n.id === connectedNodeId);
                            return connectedNode ? (
                              <div key={connectedNode.id} className="flex items-center p-2 rounded-md hover:bg-accent/50">
                                <div className="mr-2">
                                  {getNodeIcon(connectedNode.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">{connectedNode.name}</div>
                                  <div className="text-xs text-muted-foreground">{connectedNode.ip}</div>
                                </div>
                                {getStatusBadge(connectedNode.status, connectedNode.threats)}
                              </div>
                            ) : null;
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="traffic">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Network Traffic</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-12 border border-dashed rounded-md">
                          <h3 className="text-lg font-medium">Traffic Visualization</h3>
                          <p className="text-muted-foreground">
                            Real-time traffic data would be displayed here
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="threats">
                  <div className="space-y-4">
                    {selectedNode.threats > 0 ? (
                      Array.from({ length: selectedNode.threats }).map((_, i) => (
                        <Card key={i} className="border-destructive/50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                              {["Suspicious Connection", "Malware Detected", "Unusual Traffic Pattern", "Potential Data Exfiltration", "Brute Force Attempt"][i % 5]}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              {["Connection to known malicious IP address detected.", 
                                "Signature match for known malware variant.", 
                                "Unusual outbound traffic pattern detected to foreign IP.", 
                                "Large data transfer to unauthorized external endpoint.",
                                "Multiple failed authentication attempts detected."][i % 5]}
                            </p>
                            <div className="flex justify-end mt-4">
                              <Button variant="outline" size="sm" className="mr-2">Investigate</Button>
                              <Button variant="destructive" size="sm">Block</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center p-12 border border-dashed rounded-md">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <h3 className="text-lg font-medium">No Threats Detected</h3>
                        <p className="text-muted-foreground">
                          This network node is currently secure
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center p-6">
              <Globe className="h-16 w-16 mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-medium mb-2">Network Visualization</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Select a network node from the left panel to view details and analyze its connections and traffic patterns.
              </p>
              <Button onClick={() => setSelectedNode(networkNodes[0])}>
                View Main Gateway
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Network;
