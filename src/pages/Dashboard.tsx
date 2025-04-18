
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AlertTriangle, 
  ArrowDown, 
  ArrowUp, 
  BarChart3, 
  Clock, 
  Eye, 
  Globe, 
  ShieldAlert, 
  Skull 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchThreatsSuccess } from '@/features/threats/threatSlice';
import { RootState } from '@/lib/store';
import { mockThreats, mockThreatStats } from '@/data/mockThreats';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Card with metric
interface MetricCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard = ({ title, value, description, icon, trend, className }: MetricCardProps) => (
  <Card className={`dashboard-card ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.isPositive ? (
            <ArrowUp className="h-4 w-4 text-threat-low" />
          ) : (
            <ArrowDown className="h-4 w-4 text-threat-high" />
          )}
          <span className={`text-xs font-medium ${
            trend.isPositive ? 'text-threat-low' : 'text-threat-high'
          }`}>
            {trend.value}%
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Custom pie chart color scheme
const SEVERITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
  info: '#3B82F6'
};

const TYPE_COLORS = {
  malware: '#8B5CF6',
  phishing: '#EC4899',
  ransomware: '#F43F5E',
  ddos: '#F97316',
  exploit: '#14B8A6',
  apt: '#9333EA',
  other: '#64748B'
};

// Format data for pie charts
const getSeverityData = (stats: any) => {
  return [
    { name: 'High', value: stats.countBySeverity.high, color: SEVERITY_COLORS.high },
    { name: 'Medium', value: stats.countBySeverity.medium, color: SEVERITY_COLORS.medium },
    { name: 'Low', value: stats.countBySeverity.low, color: SEVERITY_COLORS.low },
    { name: 'Info', value: stats.countBySeverity.info, color: SEVERITY_COLORS.info }
  ];
};

const getTypeData = (stats: any) => {
  return [
    { name: 'Malware', value: stats.countByType.malware, color: TYPE_COLORS.malware },
    { name: 'Phishing', value: stats.countByType.phishing, color: TYPE_COLORS.phishing },
    { name: 'Ransomware', value: stats.countByType.ransomware, color: TYPE_COLORS.ransomware },
    { name: 'DDoS', value: stats.countByType.ddos, color: TYPE_COLORS.ddos },
    { name: 'Exploit', value: stats.countByType.exploit, color: TYPE_COLORS.exploit },
    { name: 'APT', value: stats.countByType.apt, color: TYPE_COLORS.apt },
    { name: 'Other', value: stats.countByType.other, color: TYPE_COLORS.other }
  ];
};

// Custom tooltip for pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border border-border rounded shadow-sm">
        <p className="text-sm font-semibold">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const stats = mockThreatStats;
  const { threats } = useSelector((state: RootState) => state.threats);
  
  // Load mock threats data when component mounts
  useEffect(() => {
    if (threats.length === 0) {
      dispatch(fetchThreatsSuccess(mockThreats));
    }
  }, [dispatch, threats.length]);

  // Format data for the bar chart
  const dailyThreatData = stats.last7Days.map((day) => ({
    date: day.date,
    threats: day.count
  }));

  const severityData = getSeverityData(stats);
  const typeData = getTypeData(stats);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Threat Intelligence Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of current threat landscape and security metrics
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Threats"
          value={stats.total}
          description="Total threats detected"
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 12, isPositive: false }}
          className="border-l-4 border-dashguard-primary"
        />
        <MetricCard
          title="Critical Threats"
          value={stats.countBySeverity.high}
          description="High severity threats"
          icon={<ShieldAlert className="h-4 w-4 text-threat-high" />}
          trend={{ value: 8, isPositive: false }}
          className="border-l-4 border-threat-high"
        />
        <MetricCard
          title="Active Threats"
          value={stats.activeCount}
          description="Currently active threats"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 5, isPositive: false }}
          className="border-l-4 border-dashguard-accent"
        />
        <MetricCard
          title="Last 24 Hours"
          value={stats.last7Days[6].count}
          description="New threats in last 24h"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 3, isPositive: true }}
          className="border-l-4 border-dashguard-light-purple"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Severity distribution */}
        <Card className="dashboard-card col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Threat Severity</CardTitle>
            <CardDescription>Distribution by severity level</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Threat types */}
        <Card className="dashboard-card col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Threat Types</CardTitle>
            <CardDescription>Distribution by threat category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top threat sources */}
        <Card className="dashboard-card col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Top Threat Origins</CardTitle>
            <CardDescription>Countries with most threat activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center">
                  <span className="text-sm font-medium w-8">{index + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{country.country}</span>
                      <span className="text-sm text-muted-foreground">{country.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-dashguard-primary h-2 rounded-full"
                        style={{
                          width: `${(country.count / stats.topCountries[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent threats chart */}
        <Card className="dashboard-card col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Threat Timeline</CardTitle>
              <CardDescription>New threats over last 7 days</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyThreatData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs" 
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <YAxis 
                  className="text-xs" 
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar 
                  dataKey="threats" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  name="Threats" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Threat sources card */}
        <Card className="dashboard-card col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Intelligence Sources</CardTitle>
            <CardDescription>Threat data providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.bySource.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{source.count} threats</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
