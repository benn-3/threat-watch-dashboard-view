import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AlertTriangle, 
  Check, 
  ChevronDown, 
  Filter, 
  MoreHorizontal, 
  Search, 
  Shield, 
  X,
  Calendar,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchThreatsSuccess, selectThreat, setFilters, resetFilters } from '@/features/threats/threatSlice';
import { mockThreats } from '@/data/mockThreats';

const SeverityBadge = ({ severity }) => {
  const styles = {
    high: 'bg-threat-high/15 text-threat-high border-threat-high hover:bg-threat-high/20',
    medium: 'bg-threat-warning/15 text-threat-warning border-threat-warning hover:bg-threat-warning/20',
    low: 'bg-threat-low/15 text-threat-low border-threat-low hover:bg-threat-low/20',
    info: 'bg-threat-info/15 text-threat-info border-threat-info hover:bg-threat-info/20',
  };

  const icons = {
    high: <AlertTriangle className="h-3 w-3 mr-1" />,
    medium: <AlertTriangle className="h-3 w-3 mr-1" />,
    low: <Shield className="h-3 w-3 mr-1" />,
    info: <Check className="h-3 w-3 mr-1" />,
  };

  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    info: 'Info',
  };

  return (
    <Badge variant="outline" className={`${styles[severity]} flex gap-1 items-center`}>
      {icons[severity]}
      {labels[severity]}
    </Badge>
  );
};

const TypeBadge = ({ type }) => {
  const styles = {
    malware: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    phishing: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    ransomware: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    ddos: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    exploit: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    apt: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300',
  };

  const labels = {
    malware: 'Malware',
    phishing: 'Phishing',
    ransomware: 'Ransomware',
    ddos: 'DDoS',
    exploit: 'Exploit',
    apt: 'APT',
    other: 'Other',
  };

  return <Badge variant="secondary" className={styles[type]}>{labels[type]}</Badge>;
};

const TagBadge = ({ tag }) => {
  return (
    <Badge 
      variant="outline" 
      className="bg-muted/50 hover:bg-muted text-muted-foreground border-muted-foreground/20"
    >
      {tag}
    </Badge>
  );
};

const ThreatDetailDrawer = ({ threat, onClose }) => {
  if (!threat) return null;

  return (
    <DrawerContent className="max-h-[80vh] overflow-auto">
      <DrawerHeader>
        <DrawerTitle className="flex items-center gap-2">
          <SeverityBadge severity={threat.severity} />
          <span>Threat Details</span>
        </DrawerTitle>
        <DrawerDescription>
          Detailed information about the selected threat indicator
        </DrawerDescription>
      </DrawerHeader>
      <div className="px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Indicator</h3>
            <p className="text-lg font-mono">{threat.indicator}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
            <div className="flex items-center gap-2">
              <TypeBadge type={threat.type} />
            </div>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
          <p>{threat.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">First Seen</h3>
            <p className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {format(new Date(threat.dateAdded), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Last Seen</h3>
            <p className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {format(new Date(threat.lastSeen), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Confidence</h3>
            <div className="flex items-center gap-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    threat.confidence > 70
                      ? 'bg-threat-high'
                      : threat.confidence > 40
                      ? 'bg-threat-warning'
                      : 'bg-threat-low'
                  }`}
                  style={{ width: `${threat.confidence}%` }}
                />
              </div>
              <span className="text-sm">{threat.confidence}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Source</h3>
            <p>{threat.source}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <Badge 
              variant={threat.isActive ? 'destructive' : 'outline'} 
              className={!threat.isActive ? 'bg-muted' : ''}
            >
              {threat.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {threat.location && (
          <div className="space-y-1 mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
            <p className="flex items-center gap-1">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {threat.location.country}
              {threat.location.city && `, ${threat.location.city}`}
            </p>
            <p className="text-sm text-muted-foreground">
              Lat: {threat.location.latitude.toFixed(4)}, Long: {threat.location.longitude.toFixed(4)}
            </p>
          </div>
        )}

        <div className="space-y-1 mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {threat.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>

        {(threat.ip || threat.domain || threat.url || threat.hash) && (
          <div className="grid grid-cols-1 gap-4 mb-4">
            {threat.ip && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">IP Address</h3>
                <p className="font-mono">{threat.ip}</p>
              </div>
            )}
            {threat.domain && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Domain</h3>
                <p className="font-mono">{threat.domain}</p>
              </div>
            )}
            {threat.url && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">URL</h3>
                <p className="font-mono text-sm break-all">{threat.url}</p>
              </div>
            )}
            {threat.hash && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Hash</h3>
                <p className="font-mono text-xs break-all">{threat.hash}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <DrawerFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DrawerFooter>
    </DrawerContent>
  );
};

const ThreatFilters = ({ onApplyFilters, onResetFilters }) => {
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);

  const allSeverities = ['high', 'medium', 'low', 'info'];
  const allTypes = ['malware', 'phishing', 'ransomware', 'ddos', 'exploit', 'apt', 'other'];
  const allSources = ['AlienVault', 'VirusTotal', 'IBM X-Force', 'Talos Intelligence', 'DashGuard Labs', 'MISP', 'SANS ISC'];

  const toggleSeverity = (severity) => {
    setSelectedSeverities(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity) 
        : [...prev, severity]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const toggleSource = (source) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source) 
        : [...prev, source]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      severity: selectedSeverities,
      type: selectedTypes,
      source: selectedSources,
    });
  };

  const handleResetFilters = () => {
    setSelectedSeverities([]);
    setSelectedTypes([]);
    setSelectedSources([]);
    onResetFilters();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Severity</h3>
        <div className="space-y-2">
          {allSeverities.map(severity => (
            <div key={severity} className="flex items-center space-x-2">
              <Checkbox 
                id={`severity-${severity}`} 
                checked={selectedSeverities.includes(severity)} 
                onCheckedChange={() => toggleSeverity(severity)}
              />
              <label htmlFor={`severity-${severity}`} className="text-sm cursor-pointer flex items-center">
                <SeverityBadge severity={severity} />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Threat Type</h3>
        <div className="space-y-2">
          {allTypes.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`type-${type}`} 
                checked={selectedTypes.includes(type)} 
                onCheckedChange={() => toggleType(type)}
              />
              <label htmlFor={`type-${type}`} className="text-sm cursor-pointer flex items-center">
                <TypeBadge type={type} />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Source</h3>
        <div className="space-y-2">
          {allSources.map(source => (
            <div key={source} className="flex items-center space-x-2">
              <Checkbox 
                id={`source-${source}`} 
                checked={selectedSources.includes(source)} 
                onCheckedChange={() => toggleSource(source)}
              />
              <label htmlFor={`source-${source}`} className="text-sm cursor-pointer">
                {source}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleResetFilters}>
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleApplyFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

const Threats = () => {
  const dispatch = useDispatch();
  const { threats, filteredThreats, filters, selectedThreat } = useSelector((state) => state.threats);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'dateAdded',
    direction: 'desc'
  });

  useEffect(() => {
    if (threats.length === 0) {
      dispatch(fetchThreatsSuccess(mockThreats));
    }
  }, [dispatch, threats.length]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch(setFilters({ searchQuery: query }));
  };

  const handleApplyFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setIsFilterOpen(false);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedThreats = [...filteredThreats].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === bValue) return 0;
    
    const modifier = sortConfig.direction === 'asc' ? 1 : -1;
    
    if (sortConfig.key === 'dateAdded' || sortConfig.key === 'lastSeen') {
      return new Date(aValue) > new Date(bValue) ? 1 * modifier : -1 * modifier;
    }
    
    return aValue > bValue ? 1 * modifier : -1 * modifier;
  });

  const handleRowClick = (threatId) => {
    dispatch(selectThreat(threatId));
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Threats Database</h1>
        <p className="text-muted-foreground">
          Browse, search and analyze threat indicators
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by indicator, description, location..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="w-full md:w-auto flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All Threats</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filters.severity.length > 0 || filters.type.length > 0 || filters.source.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.severity.map((severity) => (
            <Badge key={severity} variant="outline" className="gap-1 items-center">
              {severity}
              <X className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => {
                  dispatch(setFilters({
                    severity: filters.severity.filter(s => s !== severity)
                  }));
                }}
              />
            </Badge>
          ))}
          
          {filters.type.map((type) => (
            <Badge key={type} variant="outline" className="gap-1 items-center">
              {type}
              <X className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => {
                  dispatch(setFilters({
                    type: filters.type.filter(t => t !== type)
                  }));
                }}
              />
            </Badge>
          ))}
          
          {filters.source.map((source) => (
            <Badge key={source} variant="outline" className="gap-1 items-center">
              {source}
              <X className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => {
                  dispatch(setFilters({
                    source: filters.source.filter(s => s !== source)
                  }));
                }}
              />
            </Badge>
          ))}
          
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-7 gap-1">
            <X className="h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}

      <Card className="dashboard-card">
        <CardHeader className="py-4">
          <div className="flex justify-between items-center">
            <CardTitle>Threat Indicators</CardTitle>
            <CardDescription>
              {filteredThreats.length} results
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('severity')} className="cursor-pointer w-24">
                    <div className="flex items-center">
                      Severity
                      {sortConfig.key === 'severity' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('indicator')} className="cursor-pointer">
                    <div className="flex items-center">
                      Indicator
                      {sortConfig.key === 'indicator' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('type')} className="cursor-pointer">
                    <div className="flex items-center">
                      Type
                      {sortConfig.key === 'type' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead onClick={() => handleSort('dateAdded')} className="cursor-pointer hidden md:table-cell">
                    <div className="flex items-center">
                      Date Added
                      {sortConfig.key === 'dateAdded' && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedThreats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      No threats found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedThreats.map((threat) => (
                    <TableRow 
                      key={threat.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(threat.id)}
                    >
                      <TableCell>
                        <SeverityBadge severity={threat.severity} />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{threat.indicator}</div>
                        <div className="text-sm text-muted-foreground hidden md:table-cell">
                          {threat.location?.country}
                        </div>
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={threat.type} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <div className="truncate">{threat.description}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(threat.dateAdded), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Copy Indicator</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                            <DropdownMenuItem>Export Data</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Threat Filters</DrawerTitle>
            <DrawerDescription>
              Filter threats by various criteria
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2">
            <ThreatFilters 
              onApplyFilters={handleApplyFilters} 
              onResetFilters={handleResetFilters} 
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <ThreatDetailDrawer threat={selectedThreat} onClose={handleCloseDetail} />
      </Drawer>
    </div>
  );
};

export default Threats;
