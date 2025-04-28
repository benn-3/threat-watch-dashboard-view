
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ComposedChart, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { Activity, AlertTriangle, ArrowDown, ArrowUp, Calendar, CircleAlert, Download, Filter, LayoutDashboard, List, Percent, Shield, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';

// Mock data for analytics
const overviewData = [
  {
    name: '1 Mar',
    "High Severity": 4,
    "Medium Severity": 11,
    "Low Severity": 18,
  },
  {
    name: '8 Mar',
    "High Severity": 7,
    "Medium Severity": 15, 
    "Low Severity": 12,
  },
  {
    name: '15 Mar',
    "High Severity": 5,
    "Medium Severity": 18,
    "Low Severity": 14,
  },
  {
    name: '22 Mar',
    "High Severity": 8,
    "Medium Severity": 12,
    "Low Severity": 15,
  },
  {
    name: '29 Mar',
    "High Severity": 3,
    "Medium Severity": 9,
    "Low Severity": 18,
  },
  {
    name: '5 Apr',
    "High Severity": 6,
    "Medium Severity": 17,
    "Low Severity": 10,
  },
  {
    name: '12 Apr',
    "High Severity": 9,
    "Medium Severity": 14,
    "Low Severity": 8,
  },
  {
    name: '19 Apr',
    "High Severity": 4,
    "Medium Severity": 13,
    "Low Severity": 16,
  },
  {
    name: '26 Apr',
    "High Severity": 10,
    "Medium Severity": 11,
    "Low Severity": 7,
  },
];

const categoryData = [
  {
    name: 'Malware',
    count: 45,
    weekChange: 5
  },
  {
    name: 'Phishing',
    count: 32,
    weekChange: -3
  },
  {
    name: 'Ransomware',
    count: 18,
    weekChange: 2
  },
  {
    name: 'DDoS',
    count: 12,
    weekChange: 0
  },
  {
    name: 'Exploit',
    count: 28,
    weekChange: 7
  },
  {
    name: 'APT',
    count: 15,
    weekChange: 1
  }
];

const activityData = [
  {
    date: "April 28, 2023",
    "New Threats": 24,
    "Resolved Threats": 18,
  },
  {
    date: "April 21, 2023",
    "New Threats": 31,
    "Resolved Threats": 17,
  },
  {
    date: "April 14, 2023",
    "New Threats": 19,
    "Resolved Threats": 26,
  },
  {
    date: "April 7, 2023",
    "New Threats": 23,
    "Resolved Threats": 21,
  },
  {
    date: "March 31, 2023",
    "New Threats": 29,
    "Resolved Threats": 15,
  },
  {
    date: "March 24, 2023",
    "New Threats": 22,
    "Resolved Threats": 19,
  },
  {
    date: "March 17, 2023",
    "New Threats": 27,
    "Resolved Threats": 24,
  },
  {
    date: "March 10, 2023",
    "New Threats": 18,
    "Resolved Threats": 22,
  },
];

const topCountries = [
  { name: "United States", value: 28 },
  { name: "Russia", value: 24 },
  { name: "China", value: 22 },
  { name: "Ukraine", value: 14 },
  { name: "North Korea", value: 12 },
  { name: "Iran", value: 10 },
  { name: "Germany", value: 8 },
  { name: "Brazil", value: 7 },
];

const generateSourcesData = () => {
  const sources = ["AlienVault", "VirusTotal", "IBM X-Force", "Talos Intelligence", "DashGuard Labs", "MISP", "SANS ISC"];
  return sources.map(source => {
    const generateRandomValue = () => Math.floor(Math.random() * 30) + 5;
    return {
      name: source,
      "High": generateRandomValue(),
      "Medium": generateRandomValue(),
      "Low": generateRandomValue(),
      "Info": generateRandomValue(),
    };
  });
};

const sourcesData = generateSourcesData();

// Statistic cards
const StatCard = ({ title, value, change, icon, changeType, description }) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  const isNeutral = changeType === 'neutral';

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-md p-2 ${
          isPositive 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
            : isNegative 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {change !== null && (
          <div className="flex items-center pt-2">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-emerald-600 mr-1" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            ) : (
              <Activity className="h-3 w-3 text-gray-600 mr-1" />
            )}
            <span className={`text-xs font-medium ${
              isPositive 
                ? 'text-emerald-600' 
                : isNegative 
                  ? 'text-red-600' 
                  : 'text-muted-foreground'
            }`}>
              {isPositive ? '+' : isNegative ? '-' : ''}{Math.abs(change)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// For the analytics page components
const OverviewChart = () => {
  return (
    <Card className="dashboard-card col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Threat Activity Overview</CardTitle>
            <CardDescription>Trend of threats by severity over time</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={overviewData}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="High Severity" fill="#EF4444" />
              <Bar dataKey="Medium Severity" fill="#F59E0B" />
              <Bar dataKey="Low Severity" fill="#10B981" />
              <Line type="monotone" dataKey="High Severity" stroke="#991B1B" strokeWidth={2} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for category breakdown
const CategoryBreakdown = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Threat Categories</CardTitle>
        <CardDescription>Distribution by threat type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center">
              <div className="w-[30%]">
                <div className="text-sm font-medium">{item.name}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-dashguard-primary h-2 rounded-full"
                      style={{
                        width: `${(item.count / Math.max(...categoryData.map(d => d.count))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="ml-2 text-sm">{item.count}</span>
                </div>
              </div>
              <div className="ml-2 flex items-center">
                {item.weekChange > 0 ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {item.weekChange}
                  </Badge>
                ) : item.weekChange < 0 ? (
                  <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    {Math.abs(item.weekChange)}
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                    {item.weekChange}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Activity trend chart
const ActivityTrendChart = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Trends</CardTitle>
            <CardDescription>New vs resolved threats</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="New Threats"
                stroke="#F43F5E"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="Resolved Threats"
                stroke="#10B981"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Top countries
const TopCountriesChart = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Top Threat Origins</CardTitle>
        <CardDescription>Countries with most threat activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCountries.slice(0, 5).map((country, index) => (
            <div key={country.name} className="flex items-center">
              <span className="text-sm font-medium w-8">{index + 1}.</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{country.name}</span>
                  <span className="text-sm text-muted-foreground">{country.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-dashguard-primary h-2 rounded-full"
                    style={{
                      width: `${(country.value / topCountries[0].value) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Sources breakdown
const SourcesBreakdownChart = () => {
  return (
    <Card className="dashboard-card col-span-2">
      <CardHeader>
        <CardTitle>Intelligence Sources</CardTitle>
        <CardDescription>Threat indicators by source and severity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sourcesData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" scale="band" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="High" fill="#EF4444" stackId="a" />
              <Bar dataKey="Medium" fill="#F59E0B" stackId="a" />
              <Bar dataKey="Low" fill="#10B981" stackId="a" />
              <Bar dataKey="Info" fill="#3B82F6" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Main analytics component
const Analytics = () => {
  const [view, setView] = useState("overview");
  const { threats } = useSelector((state) => state.threats);
  
  // Calculate some statistics from the threat data
  const activeThreats = threats.filter(threat => threat.isActive).length;
  const highSeverityThreats = threats.filter(threat => threat.severity === 'high').length;
  const resolvedThreats = threats.length - activeThreats;
  
  const averageConfidence = threats.length > 0 
    ? Math.round(threats.reduce((sum, threat) => sum + threat.confidence, 0) / threats.length) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Analyze threat trends and statistics
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends">
              <Activity className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="sources">
              <Filter className="h-4 w-4 mr-2" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="reports">
              <List className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Threats"
            value={activeThreats}
            change={12}
            changeType="negative"
            icon={<CircleAlert className="h-4 w-4" />}
            description="Currently tracked threats"
          />

          <StatCard
            title="High Severity"
            value={highSeverityThreats}
            change={4}
            changeType="negative"
            icon={<AlertTriangle className="h-4 w-4" />}
            description="Critical threat indicators"
          />

          <StatCard
            title="Resolved"
            value={resolvedThreats}
            change={18}
            changeType="positive"
            icon={<Shield className="h-4 w-4" />}
            description="Mitigated in last 30 days"
          />

          <StatCard
            title="Confidence"
            value={`${averageConfidence}%`}
            change={2}
            changeType="positive"
            icon={<Percent className="h-4 w-4" />}
            description="Average confidence score"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <OverviewChart />
          <CategoryBreakdown />
        </div>
      </TabsContent>

      <TabsContent value="trends" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <ActivityTrendChart />
          <TopCountriesChart />
        </div>
      </TabsContent>

      <TabsContent value="sources" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <SourcesBreakdownChart />
          {/* Add more charts or components here */}
        </div>
      </TabsContent>

      <TabsContent value="reports" className="space-y-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Threat Intelligence Reports</CardTitle>
            <CardDescription>
              Download and export detailed reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Report generation functionality will be implemented soon.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default Analytics;
