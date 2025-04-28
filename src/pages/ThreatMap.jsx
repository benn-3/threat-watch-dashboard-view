import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers, Maximize, Minimize, Globe, Activity, MapPin, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

let L;
let map;
let threatMarkers = [];
let markerLayer;

const severityColors = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
  info: '#3B82F6'
};

const ThreatMap = () => {
  const mapContainerRef = useRef(null);
  const { threats } = useSelector((state) => state.threats);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filteredThreats, setFilteredThreats] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedSeverities, setSelectedSeverities] = useState(['high', 'medium', 'low', 'info']);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0);
  const [viewType, setViewType] = useState('clusters');
  const [mapView, setMapView] = useState('standard');
  const [statsByCountry, setStatsByCountry] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const toggleSeverity = (severity) => {
    setSelectedSeverities(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity) 
        : [...prev, severity]
    );
  };

  useEffect(() => {
    const filtered = threats.filter(threat => (
      selectedSeverities.includes(threat.severity) &&
      threat.confidence >= confidenceThreshold &&
      (selectedCountry ? threat.location?.country === selectedCountry : true) &&
      threat.location?.latitude && threat.location?.longitude
    ));
    
    setFilteredThreats(filtered);
    
    const countryStats = {};
    filtered.forEach(threat => {
      if (threat.location?.country) {
        countryStats[threat.location.country] = (countryStats[threat.location.country] || 0) + 1;
      }
    });
    
    const statsArray = Object.entries(countryStats)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
    
    setStatsByCountry(statsArray);
  }, [threats, selectedSeverities, confidenceThreshold, selectedCountry]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initializeMap = async () => {
      if (!mapContainerRef.current) return;
      
      L = await import('leaflet');
      
      if (!mapLoaded) {
        map = L.map(mapContainerRef.current, {
          center: [20, 0],
          zoom: 2,
          minZoom: 2,
          maxZoom: 18,
          zoomControl: false
        });
        
        L.control.zoom({
          position: 'topright'
        }).addTo(map);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        markerLayer = L.layerGroup().addTo(map);
        setMapLoaded(true);
      }
      
      if (mapLoaded) {
        markerLayer.clearLayers();
        threatMarkers = [];
        
        filteredThreats.forEach(threat => {
          if (threat.location && threat.location.latitude && threat.location.longitude) {
            const icon = L.divIcon({
              html: `<div style="background-color: ${severityColors[threat.severity]}; border-radius: 50%; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white;">${
                threat.severity === 'high' ? '!' : 
                threat.severity === 'medium' ? '!' : 
                threat.severity === 'low' ? 'i' : 'i'
              }</div>`,
              className: '',
              iconSize: [24, 24]
            });
            
            const marker = L.marker([threat.location.latitude, threat.location.longitude], {
              icon,
              threat: threat
            });
            
            marker.bindPopup(`
              <div style="min-width: 200px;">
                <div style="font-weight: bold; margin-bottom: 5px;">${threat.indicator}</div>
                <div style="font-size: 0.9em; margin-bottom: 5px;">${threat.description}</div>
                <div style="font-size: 0.8em; color: #666;">
                  <div>Type: ${threat.type}</div>
                  <div>Severity: ${threat.severity}</div>
                  <div>Source: ${threat.source}</div>
                  <div>Location: ${threat.location.country}${threat.location.city ? `, ${threat.location.city}` : ''}</div>
                </div>
              </div>
            `);
            
            marker.addTo(markerLayer);
            threatMarkers.push(marker);
          }
        });
        
        map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
          }
        });
        
        if (mapView === 'standard') {
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
        } else {
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          }).addTo(map);
        }
        
        markerLayer.bringToFront();
      }
    };
    
    initializeMap();
    
    return () => {
      if (map) {
        map.remove();
        map = null;
        threatMarkers = [];
        markerLayer = null;
        setMapLoaded(false);
      }
    };
  }, [filteredThreats, mapLoaded, viewType, mapView]);

  const toggleFullscreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-background pt-16' : ''}`}>
      <div className={`flex flex-col ${isFullScreen ? 'hidden' : ''}`}>
        <h1 className="text-3xl font-bold tracking-tight">Threat Map</h1>
        <p className="text-muted-foreground">
          Geographic visualization of threat activity
        </p>
      </div>

      <div className={`grid gap-6 ${isFullScreen ? 'h-full grid-rows-[auto_1fr]' : 'md:grid-cols-3'}`}>
        <Card className={`dashboard-card ${isFullScreen ? 'col-span-3 row-span-1' : 'md:col-span-2'} relative overflow-hidden`}>
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Global Threat Distribution</CardTitle>
              <CardDescription>
                Showing {filteredThreats.length} threats across {statsByCountry.length} countries
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="clusters" className="hidden md:block" onValueChange={(value) => setViewType(value)}>
                <TabsList>
                  <TabsTrigger value="clusters">
                    <Layers className="h-4 w-4 mr-2" />
                    Clusters
                  </TabsTrigger>
                  <TabsTrigger value="markers">
                    <MapPin className="h-4 w-4 mr-2" />
                    Individual
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={mapContainerRef} 
              className={`w-full ${isFullScreen ? 'h-[calc(100vh-160px)]' : 'h-[500px]'}`}
            ></div>

            <div className="absolute bottom-4 left-4 z-10 space-y-2">
              <Button
                variant={mapView === 'standard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('standard')}
                className="w-full"
              >
                <Globe className="h-4 w-4 mr-2" />
                Standard
              </Button>
              <Button
                variant={mapView === 'satellite' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('satellite')}
                className="w-full"
              >
                <Globe className="h-4 w-4 mr-2" />
                Satellite
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className={`space-y-6 ${isFullScreen ? 'absolute right-4 top-20 w-80 z-10' : ''}`}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Map Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Severity</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="severity-high" 
                      checked={selectedSeverities.includes('high')} 
                      onCheckedChange={() => toggleSeverity('high')}
                    />
                    <Label htmlFor="severity-high" className="flex items-center">
                      <Badge className="bg-threat-high/15 text-threat-high border-threat-high hover:bg-threat-high/20 flex gap-1 items-center">
                        <ShieldAlert className="h-3 w-3" />
                        High
                      </Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="severity-medium" 
                      checked={selectedSeverities.includes('medium')} 
                      onCheckedChange={() => toggleSeverity('medium')}
                    />
                    <Label htmlFor="severity-medium" className="flex items-center">
                      <Badge className="bg-threat-warning/15 text-threat-warning border-threat-warning hover:bg-threat-warning/20 flex gap-1 items-center">
                        <AlertTriangle className="h-3 w-3" />
                        Medium
                      </Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="severity-low" 
                      checked={selectedSeverities.includes('low')} 
                      onCheckedChange={() => toggleSeverity('low')}
                    />
                    <Label htmlFor="severity-low" className="flex items-center">
                      <Badge className="bg-threat-low/15 text-threat-low border-threat-low hover:bg-threat-low/20 flex gap-1 items-center">
                        <Activity className="h-3 w-3" />
                        Low
                      </Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="severity-info" 
                      checked={selectedSeverities.includes('info')} 
                      onCheckedChange={() => toggleSeverity('info')}
                    />
                    <Label htmlFor="severity-info" className="flex items-center">
                      <Badge className="bg-threat-info/15 text-threat-info border-threat-info hover:bg-threat-info/20 flex gap-1 items-center">
                        <Info className="h-3 w-3" />
                        Info
                      </Badge>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confidence">Confidence Threshold</Label>
                  <span className="text-sm text-muted-foreground">{confidenceThreshold}%+</span>
                </div>
                <Slider
                  id="confidence"
                  min={0}
                  max={100}
                  step={5}
                  value={[confidenceThreshold]}
                  onValueChange={(value) => setConfidenceThreshold(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Filter by Country</Label>
                <Select 
                  value={selectedCountry || 'all'} 
                  onValueChange={(value) => setSelectedCountry(value === 'all' ? null : value)}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="All countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All countries</SelectItem>
                    {statsByCountry.map(country => (
                      <SelectItem key={country.country} value={country.country}>
                        {country.country} ({country.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Threat Hotspots</CardTitle>
              <CardDescription>Countries with most threat activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsByCountry.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center">
                    <span className="text-sm font-medium w-8">{index + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal text-sm"
                          onClick={() => setSelectedCountry(country.country)}
                        >
                          {country.country}
                        </Button>
                        <span className="text-sm text-muted-foreground">{country.count}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-dashguard-primary h-2 rounded-full"
                          style={{
                            width: `${(country.count / statsByCountry[0].count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {selectedCountry && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedCountry(null)}
                    >
                      Show All Countries
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Severity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['high', 'medium', 'low', 'info'].map((severity) => {
                  const count = filteredThreats.filter(t => t.severity === severity).length;
                  const percentage = filteredThreats.length > 0 
                    ? Math.round((count / filteredThreats.length) * 100) 
                    : 0;
                  
                  return (
                    <div key={severity} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`
                            ${severity === 'high' && 'bg-threat-high/15 text-threat-high border-threat-high'} 
                            ${severity === 'medium' && 'bg-threat-warning/15 text-threat-warning border-threat-warning'} 
                            ${severity === 'low' && 'bg-threat-low/15 text-threat-low border-threat-low'} 
                            ${severity === 'info' && 'bg-threat-info/15 text-threat-info border-threat-info'}
                          `}
                          variant="outline"
                        >
                          {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </Badge>
                        <span className="text-sm">
                          {count} <span className="text-muted-foreground">({percentage}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            severity === 'high' && 'bg-threat-high'
                          } ${
                            severity === 'medium' && 'bg-threat-warning'
                          } ${
                            severity === 'low' && 'bg-threat-low'
                          } ${
                            severity === 'info' && 'bg-threat-info'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThreatMap;
