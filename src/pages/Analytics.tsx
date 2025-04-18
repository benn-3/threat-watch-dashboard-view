
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/use-redux-hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, ChartBar, ChartPie, Filter, BarChart3, PieChart } from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { Threat, ThreatSeverity, ThreatType } from '@/features/threats/threatSlice';

const Analytics = () => {
  const { threats } = useAppSelector((state) => state.threats);
  const [activeTab, setActiveTab] = useState('summary');
  const [timeRange, setTimeRange] = useState('7days');

  const calculateTimeRangeData = () => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '24hours':
        startDate = subDays(now, 1);
        break;
      case '7days':
        startDate = subDays(now, 7);
        break;
      case '30days':
        startDate = subDays(now, 30);
        break;
      case '90days':
        startDate = subDays(now, 90);
        break;
      default:
        startDate = subDays(now, 7);
    }
    
    return threats.filter(threat => new Date(threat.dateAdded) >= startDate);
  };

  const filteredThreats = calculateTimeRangeData();

  // ---- Data for Pie Charts ----
  
  // Threat Type Distribution
  const typeData = React.useMemo(() => {
    const typeCounts: Record<string, number> = {};
    filteredThreats.forEach(threat => {
      typeCounts[threat.type] = (typeCounts[threat.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [filteredThreats]);
  
  // Severity Distribution
  const severityData = React.useMemo(() => {
    const severityCounts: Record<string, number> = {};
    filteredThreats.forEach(threat => {
      severityCounts[threat.severity] = (severityCounts[threat.severity] || 0) + 1;
    });
    
    return Object.entries(severityCounts).map(([name, value]) => ({ name, value }));
  }, [filteredThreats]);
  
  // Source Distribution
  const sourceData = React.useMemo(() => {
    const sourceCounts: Record<string, number> = {};
    filteredThreats.forEach(threat => {
      sourceCounts[threat.source] = (sourceCounts[threat.source] || 0) + 1;
    });
    
    // Only take top 5 sources
    return Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [filteredThreats]);
  
  // ---- Data for Bar Charts ----
  
  // Threats by Date
  const threatsByDate = React.useMemo(() => {
    const dateCounts: Record<string, number> = {};
    
    // Generate all dates in the range
    const days = timeRange === '24hours' ? 1 : 
                timeRange === '7days' ? 7 : 
                timeRange === '30days' ? 30 : 90;
    
    for (let i = 0; i < days; i++) {
      const date = subDays(new Date(), i);
      const formattedDate = format(date, 'MMM dd');
      dateCounts[formattedDate] = 0;
    }
    
    // Fill in the actual counts
    filteredThreats.forEach(threat => {
      const date = format(new Date(threat.dateAdded), 'MMM dd');
      if (dateCounts[date] !== undefined) {
        dateCounts[date] += 1;
      }
    });
    
    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .reverse();
  }, [filteredThreats, timeRange]);
  
  // Threats by Country
  const threatsByCountry = React.useMemo(() => {
    const countryCounts: Record<string, number> = {};
    
    filteredThreats.forEach(threat => {
      if (threat.location?.country) {
        countryCounts[threat.location.country] = (countryCounts[threat.location.country] || 0) + 1;
      }
    });
    
    return Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));
  }, [filteredThreats]);

  // Color configurations
  const COLORS = {
    severity: {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981',
      info: '#3B82F6'
    },
    type: {
      malware: '#8B5CF6', 
      phishing: '#EC4899',
      ransomware: '#EF4444',
      ddos: '#F97316',
      exploit: '#14B8A6',
      apt: '#6366F1',
      other: '#6B7280'
    },
    source: ['#8B5CF6', '#EC4899', '#F97316', '#14B8A6', '#6366F1']
  };

  // Summary stats
  const stats = React.useMemo(() => {
    const totalThreats = filteredThreats.length;
    
    const severityCounts = {
      high: filteredThreats.filter(t => t.severity === 'high').length,
      medium: filteredThreats.filter(t => t.severity === 'medium').length,
      low: filteredThreats.filter(t => t.severity === 'low').length,
      info: filteredThreats.filter(t => t.severity === 'info').length
    };
    
    const activeThreats = filteredThreats.filter(t => t.isActive).length;
    
    const uniqueCountries = new Set(
      filteredThreats
        .filter(t => t.location?.country)
        .map(t => t.location?.country)
    ).size;
    
    const averageConfidence = filteredThreats.length > 0 
      ? Math.round(filteredThreats.reduce((acc, t) => acc + t.confidence, 0) / filteredThreats.length) 
      : 0;
    
    return {
      totalThreats,
      severityCounts,
      activeThreats,
      uniqueCountries,
      averageConfidence
    };
  }, [filteredThreats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Threat Analytics</h1>
        <p className="text-muted-foreground">
          Advanced insights and statistics on threat intelligence
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="summary">
              <BarChart3 className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <PieChart className="h-4 w-4 mr-2" />
              Distribution
            </TabsTrigger>
            <TabsTrigger value="trends">
              <ChartBar className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button
            variant={timeRange === '24hours' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('24hours')}
          >
            24h
          </Button>
          <Button
            variant={timeRange === '7days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7days')}
          >
            7d
          </Button>
          <Button
            variant={timeRange === '30days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30days')}
          >
            30d
          </Button>
          <Button
            variant={timeRange === '90days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90days')}
          >
            90d
          </Button>
        </div>
      </div>

      {/* Summary Tab */}
      <TabsContent value="summary" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Threats
              </CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalThreats}</div>
              <p className="text-xs text-muted-foreground">
                {timeRange === '24hours' ? 'Last 24 hours' : 
                 timeRange === '7days' ? 'Last 7 days' : 
                 timeRange === '30days' ? 'Last 30 days' : 'Last 90 days'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High Severity
              </CardTitle>
              <div className="h-4 w-4 rounded-full bg-threat-high" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.severityCounts.high}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.severityCounts.high / stats.totalThreats) * 100) || 0}% of total threats
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Threats
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeThreats}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeThreats / stats.totalThreats) * 100) || 0}% of total threats
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Confidence
              </CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageConfidence}%</div>
              <p className="text-xs text-muted-foreground">
                Across {stats.uniqueCountries} countries
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Threats by Date</CardTitle>
              <CardDescription>
                New threats detected over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={threatsByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Severity Distribution</CardTitle>
              <CardDescription>
                Breakdown by threat severity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    high: { label: "High", color: COLORS.severity.high },
                    medium: { label: "Medium", color: COLORS.severity.medium },
                    low: { label: "Low", color: COLORS.severity.low },
                    info: { label: "Info", color: COLORS.severity.info }
                  }}
                >
                  <RechartsChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {severityData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS.severity[entry.name as ThreatSeverity] || '#6B7280'} 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                  </RechartsChart>
                  <ChartLegend content={<ChartLegendContent />} />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Distribution Tab */}
      <TabsContent value="distribution" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Threat Types</CardTitle>
              <CardDescription>
                Distribution by threat category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    malware: { label: "Malware", color: COLORS.type.malware },
                    phishing: { label: "Phishing", color: COLORS.type.phishing },
                    ransomware: { label: "Ransomware", color: COLORS.type.ransomware },
                    ddos: { label: "DDoS", color: COLORS.type.ddos },
                    exploit: { label: "Exploit", color: COLORS.type.exploit },
                    apt: { label: "APT", color: COLORS.type.apt },
                    other: { label: "Other", color: COLORS.type.other }
                  }}
                >
                  <RechartsChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {typeData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS.type[entry.name as ThreatType] || '#6B7280'} 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                  </RechartsChart>
                  <ChartLegend content={<ChartLegendContent />} />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Threat Sources</CardTitle>
              <CardDescription>
                Top 5 intelligence sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={
                    Object.fromEntries(
                      sourceData.map((entry, index) => [
                        entry.name,
                        { 
                          label: entry.name, 
                          color: COLORS.source[index % COLORS.source.length] 
                        }
                      ])
                    )
                  }
                >
                  <RechartsChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS.source[index % COLORS.source.length]} 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                  </RechartsChart>
                  <ChartLegend content={<ChartLegendContent />} />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>
              Threats by country
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={threatsByCountry}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="country" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Trends Tab */}
      <TabsContent value="trends" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Threat Activity Timeline</CardTitle>
              <CardDescription>
                Daily trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={threatsByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>High Severity Threats</CardTitle>
              <CardDescription>
                Recent critical security threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredThreats
                  .filter(threat => threat.severity === 'high')
                  .slice(0, 4)
                  .map(threat => (
                    <div key={threat.id} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-threat-high/15 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-threat-high" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{threat.indicator}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(threat.dateAdded), 'MMM d, yyyy')}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {threat.type}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Most Active Sources</CardTitle>
              <CardDescription>
                Intelligence sources with most activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  filteredThreats.reduce((acc, threat) => {
                    acc[threat.source] = (acc[threat.source] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([source, count], index) => (
                    <div key={source} className="flex items-center">
                      <span className="text-sm font-medium w-8">{index + 1}.</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{source}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-dashguard-primary h-2 rounded-full"
                            style={{
                              width: `${(count / filteredThreats.length) * 100}%`,
                              backgroundColor: COLORS.source[index % COLORS.source.length]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
};

export default Analytics;
