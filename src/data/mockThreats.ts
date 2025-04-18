
import { Threat, ThreatSeverity, ThreatType } from '@/features/threats/threatSlice';

export const generateMockThreats = (): Threat[] => {
  const threats: Threat[] = [];
  const now = new Date();
  
  const severities: ThreatSeverity[] = ['high', 'medium', 'low', 'info'];
  const types: ThreatType[] = ['malware', 'phishing', 'ransomware', 'ddos', 'exploit', 'apt', 'other'];
  const sources = ['AlienVault', 'VirusTotal', 'IBM X-Force', 'Talos Intelligence', 'DashGuard Labs', 'MISP', 'SANS ISC'];
  
  // Generate some random IP-based threats
  for (let i = 0; i < 25; i++) {
    const id = `IP-${i + 1}`;
    const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    // Random dates within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const randomDate = new Date(now);
    randomDate.setDate(randomDate.getDate() - daysAgo);
    
    // Random last seen date between the added date and now
    const daysSinceThen = Math.floor(Math.random() * daysAgo);
    const lastSeenDate = new Date(randomDate);
    lastSeenDate.setDate(lastSeenDate.getDate() + daysSinceThen);
    
    // Generate random latitude/longitude
    const lat = (Math.random() * 180) - 90;
    const lng = (Math.random() * 360) - 180;
    
    // Countries for our random locations
    const countries = ['United States', 'Russia', 'China', 'Brazil', 'India', 'Germany', 'France', 'United Kingdom', 'Canada', 'Australia', 'Japan', 'North Korea'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    // Cities for our random locations
    const cities: Record<string, string[]> = {
      'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
      'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
      'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu'],
      'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
      'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
      'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
      'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
      'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool'],
      'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
      'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
      'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
      'North Korea': ['Pyongyang', 'Hamhung', 'Chongjin', 'Nampo', 'Wonsan']
    };
    
    const randomCity = cities[randomCountry][Math.floor(Math.random() * cities[randomCountry].length)];
    
    // Random threat descriptions based on type
    const descriptions: Record<ThreatType, string[]> = {
      'malware': [
        `Trojan malware communicating with C2 server at ${randomIP}`,
        `Keylogger activity detected from ${randomIP}`,
        `Botnet command node detected at ${randomIP}`
      ],
      'phishing': [
        `Phishing campaign originating from ${randomIP}`,
        `Credential harvesting server at ${randomIP}`,
        `Fake login page hosted at ${randomIP}`
      ],
      'ransomware': [
        `Ransomware distribution node at ${randomIP}`,
        `Encryption key exchange detected from ${randomIP}`,
        `Ransomware C2 server at ${randomIP}`
      ],
      'ddos': [
        `DDoS amplification server at ${randomIP}`,
        `Part of botnet launching DDoS attacks`,
        `NTP amplification reflector at ${randomIP}`
      ],
      'exploit': [
        `Vulnerability scanning from ${randomIP}`,
        `Exploit kit hosting detected at ${randomIP}`,
        `Zero-day exploit distribution from ${randomIP}`
      ],
      'apt': [
        `APT group infrastructure detected at ${randomIP}`,
        `Nation-state actor command center at ${randomIP}`,
        `Long-term persistence infrastructure at ${randomIP}`
      ],
      'other': [
        `Suspicious activity from ${randomIP}`,
        `Anomalous network behavior from ${randomIP}`,
        `Unknown but suspicious traffic from ${randomIP}`
      ]
    };
    
    const randomDescription = descriptions[randomType][Math.floor(Math.random() * descriptions[randomType].length)];
    
    // Random tags based on type and severity
    const tagOptions = ['suspicious', 'verified', 'active', 'blocked', 'investigating', 'tor-exit-node', 'vpn', randomCountry.toLowerCase(), randomType];
    const tags = [];
    const numTags = Math.floor(Math.random() * 4) + 1; // 1-4 tags
    for (let t = 0; t < numTags; t++) {
      const randomTag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
      if (!tags.includes(randomTag)) {
        tags.push(randomTag);
      }
    }
    
    // Add severity as a tag
    tags.push(randomSeverity);
    
    threats.push({
      id,
      indicator: randomIP,
      type: randomType,
      severity: randomSeverity,
      source: randomSource,
      dateAdded: randomDate.toISOString(),
      lastSeen: lastSeenDate.toISOString(),
      description: randomDescription,
      ip: randomIP,
      location: {
        country: randomCountry,
        city: randomCity,
        latitude: lat,
        longitude: lng
      },
      tags,
      confidence: Math.floor(Math.random() * 101), // 0-100
      isActive: Math.random() > 0.3 // 70% active
    });
  }
  
  // Generate some domain-based threats
  const domainSuffixes = ['.com', '.net', '.org', '.ru', '.cn', '.io', '.xyz', '.info', '.cc', '.biz'];
  const domainPrefixes = ['secure', 'login', 'account', 'mail', 'update', 'download', 'service', 'support', 'user', 'admin'];
  const domainMiddle = ['bank', 'pay', 'wallet', 'cloud', 'web', 'app', 'site', 'online', 'center', 'portal'];
  
  for (let i = 0; i < 15; i++) {
    const id = `DOMAIN-${i + 1}`;
    const randomPrefix = domainPrefixes[Math.floor(Math.random() * domainPrefixes.length)];
    const randomMiddle = domainMiddle[Math.floor(Math.random() * domainMiddle.length)];
    const randomSuffix = domainSuffixes[Math.floor(Math.random() * domainSuffixes.length)];
    const randomDomain = `${randomPrefix}-${randomMiddle}${randomSuffix}`;
    
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    // Random dates within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const randomDate = new Date(now);
    randomDate.setDate(randomDate.getDate() - daysAgo);
    
    // Random last seen date between the added date and now
    const daysSinceThen = Math.floor(Math.random() * daysAgo);
    const lastSeenDate = new Date(randomDate);
    lastSeenDate.setDate(lastSeenDate.getDate() + daysSinceThen);
    
    // Generate random latitude/longitude
    const lat = (Math.random() * 180) - 90;
    const lng = (Math.random() * 360) - 180;
    
    // Countries for our random locations
    const countries = ['United States', 'Russia', 'China', 'Brazil', 'India', 'Germany', 'France', 'United Kingdom', 'Canada', 'Australia', 'Japan', 'North Korea'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    // Cities for our random locations (reusing the same object from above)
    const cities: Record<string, string[]> = {
      'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
      'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
      'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu'],
      'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
      'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
      'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
      'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
      'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool'],
      'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
      'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
      'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
      'North Korea': ['Pyongyang', 'Hamhung', 'Chongjin', 'Nampo', 'Wonsan']
    };
    
    const randomCity = cities[randomCountry][Math.floor(Math.random() * cities[randomCountry].length)];
    
    // Random domain descriptions based on type
    const domainDescriptions: Record<ThreatType, string[]> = {
      'malware': [
        `Malware distribution domain ${randomDomain}`,
        `Drive-by download host at ${randomDomain}`,
        `Malicious JavaScript serving from ${randomDomain}`
      ],
      'phishing': [
        `Phishing site mimicking popular service at ${randomDomain}`,
        `Bank credential harvesting at ${randomDomain}`,
        `Fake login portal hosted at ${randomDomain}`
      ],
      'ransomware': [
        `Ransomware payment portal at ${randomDomain}`,
        `Ransomware distribution site ${randomDomain}`,
        `Encryption key exchange at ${randomDomain}`
      ],
      'ddos': [
        `DDoS command and control at ${randomDomain}`,
        `Botnet coordination domain ${randomDomain}`,
        `DDoS toolkit hosted at ${randomDomain}`
      ],
      'exploit': [
        `Exploit kit hosting at ${randomDomain}`,
        `Zero-day exploit distribution from ${randomDomain}`,
        `Vulnerability scanner hosted at ${randomDomain}`
      ],
      'apt': [
        `APT command and control domain ${randomDomain}`,
        `Nation-state actor infrastructure at ${randomDomain}`,
        `Long-term persistence domain ${randomDomain}`
      ],
      'other': [
        `Suspicious domain ${randomDomain}`,
        `Newly registered suspicious domain ${randomDomain}`,
        `Anomalous domain activity from ${randomDomain}`
      ]
    };
    
    const randomDescription = domainDescriptions[randomType][Math.floor(Math.random() * domainDescriptions[randomType].length)];
    
    // Random tags based on type and severity
    const tagOptions = ['suspicious', 'verified', 'active', 'blocked', 'investigating', 'newly-registered', 'dga', randomCountry.toLowerCase(), randomType];
    const tags = [];
    const numTags = Math.floor(Math.random() * 4) + 1; // 1-4 tags
    for (let t = 0; t < numTags; t++) {
      const randomTag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
      if (!tags.includes(randomTag)) {
        tags.push(randomTag);
      }
    }
    
    // Add severity as a tag
    tags.push(randomSeverity);
    
    threats.push({
      id,
      indicator: randomDomain,
      type: randomType,
      severity: randomSeverity,
      source: randomSource,
      dateAdded: randomDate.toISOString(),
      lastSeen: lastSeenDate.toISOString(),
      description: randomDescription,
      domain: randomDomain,
      location: {
        country: randomCountry,
        city: randomCity,
        latitude: lat,
        longitude: lng
      },
      tags,
      confidence: Math.floor(Math.random() * 101), // 0-100
      isActive: Math.random() > 0.3 // 70% active
    });
  }
  
  // Generate some URL-based threats
  const urlPaths = ['/login', '/account', '/update', '/security', '/verify', '/download', '/payment', '/checkout', '/admin', '/api'];
  
  for (let i = 0; i < 10; i++) {
    const id = `URL-${i + 1}`;
    const randomDomainIndex = Math.floor(Math.random() * 15);
    const randomDomain = threats[randomDomainIndex + 25].domain; // Use one of the domains we created
    const randomPath = urlPaths[Math.floor(Math.random() * urlPaths.length)];
    const randomURL = `https://${randomDomain}${randomPath}`;
    
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    // Use the same location as the domain
    const domainLocation = threats[randomDomainIndex + 25].location;
    
    // Random dates within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const randomDate = new Date(now);
    randomDate.setDate(randomDate.getDate() - daysAgo);
    
    // Random last seen date between the added date and now
    const daysSinceThen = Math.floor(Math.random() * daysAgo);
    const lastSeenDate = new Date(randomDate);
    lastSeenDate.setDate(lastSeenDate.getDate() + daysSinceThen);
    
    // Random URL descriptions based on type
    const urlDescriptions: Record<ThreatType, string[]> = {
      'malware': [
        `Malware download URL: ${randomURL}`,
        `Malicious script at ${randomURL}`,
        `Trojan dropper at ${randomURL}`
      ],
      'phishing': [
        `Phishing page at ${randomURL}`,
        `Credential harvester at ${randomURL}`,
        `Fake login form at ${randomURL}`
      ],
      'ransomware': [
        `Ransomware binary at ${randomURL}`,
        `Ransomware landing page: ${randomURL}`,
        `Encryption instructions at ${randomURL}`
      ],
      'ddos': [
        `DDoS tool download at ${randomURL}`,
        `Botnet controller at ${randomURL}`,
        `Attack coordination page at ${randomURL}`
      ],
      'exploit': [
        `Exploit serving URL: ${randomURL}`,
        `Browser vulnerability exploit at ${randomURL}`,
        `0-day distribution at ${randomURL}`
      ],
      'apt': [
        `APT backdoor at ${randomURL}`,
        `Nation-state malware at ${randomURL}`,
        `Targeted attack landing page: ${randomURL}`
      ],
      'other': [
        `Suspicious URL: ${randomURL}`,
        `Unknown malicious behavior at ${randomURL}`,
        `Suspicious redirect chain including ${randomURL}`
      ]
    };
    
    const randomDescription = urlDescriptions[randomType][Math.floor(Math.random() * urlDescriptions[randomType].length)];
    
    // Random tags similar to domains
    const tagOptions = ['suspicious', 'verified', 'active', 'blocked', 'investigating', 'redirector', domainLocation.country.toLowerCase(), randomType];
    const tags = [];
    const numTags = Math.floor(Math.random() * 4) + 1; // 1-4 tags
    for (let t = 0; t < numTags; t++) {
      const randomTag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
      if (!tags.includes(randomTag)) {
        tags.push(randomTag);
      }
    }
    
    // Add severity as a tag
    tags.push(randomSeverity);
    
    threats.push({
      id,
      indicator: randomURL,
      type: randomType,
      severity: randomSeverity,
      source: randomSource,
      dateAdded: randomDate.toISOString(),
      lastSeen: lastSeenDate.toISOString(),
      description: randomDescription,
      url: randomURL,
      domain: randomDomain, // Associate with domain
      location: domainLocation, // Same location as domain
      tags,
      confidence: Math.floor(Math.random() * 101), // 0-100
      isActive: Math.random() > 0.3 // 70% active
    });
  }
  
  return threats;
};

// Export mock threats
export const mockThreats = generateMockThreats();

// Generate statistics for dashboard
export const generateThreatStats = (threats: Threat[]) => {
  // Count by severity
  const countBySeverity = {
    high: threats.filter(t => t.severity === 'high').length,
    medium: threats.filter(t => t.severity === 'medium').length,
    low: threats.filter(t => t.severity === 'low').length,
    info: threats.filter(t => t.severity === 'info').length,
  };
  
  // Count by type
  const countByType = {
    malware: threats.filter(t => t.type === 'malware').length,
    phishing: threats.filter(t => t.type === 'phishing').length,
    ransomware: threats.filter(t => t.type === 'ransomware').length,
    ddos: threats.filter(t => t.type === 'ddos').length,
    exploit: threats.filter(t => t.type === 'exploit').length,
    apt: threats.filter(t => t.type === 'apt').length,
    other: threats.filter(t => t.type === 'other').length,
  };
  
  // Count by country (top 5)
  const countryCounts: Record<string, number> = {};
  threats.forEach(threat => {
    if (threat.location?.country) {
      countryCounts[threat.location.country] = (countryCounts[threat.location.country] || 0) + 1;
    }
  });
  
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }));
  
  // Count by date (last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    last7Days.push({
      date: date.toISOString().split('T')[0],
      count: threats.filter(t => {
        const threatDate = new Date(t.dateAdded);
        threatDate.setHours(0, 0, 0, 0);
        return threatDate.getTime() === date.getTime();
      }).length
    });
  }
  
  // Count active vs inactive
  const activeCount = threats.filter(t => t.isActive).length;
  const inactiveCount = threats.length - activeCount;
  
  // Count by source
  const sourceCounts: Record<string, number> = {};
  threats.forEach(threat => {
    sourceCounts[threat.source] = (sourceCounts[threat.source] || 0) + 1;
  });
  
  const bySource = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }));
  
  return {
    total: threats.length,
    countBySeverity,
    countByType,
    topCountries,
    last7Days,
    activeCount,
    inactiveCount,
    bySource
  };
};

export const mockThreatStats = generateThreatStats(mockThreats);
