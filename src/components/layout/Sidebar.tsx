
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Map, 
  AlertTriangle, 
  Home, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Globe,
  Terminal,
  Users,
  Newspaper,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RootState } from '@/lib/store';
import { setSidebarCollapsed } from '@/features/ui/uiSlice';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const mainLinks: SidebarLink[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Threats', href: '/threats', icon: AlertTriangle },
  { name: 'Threat Map', href: '/map', icon: Map },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const moreLinks: SidebarLink[] = [
  { name: 'Intelligence Feed', href: '/feeds', icon: Newspaper },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Network', href: '/network', icon: Globe },
  { name: 'Entities', href: '/entities', icon: Users },
  { name: 'SIEM', href: '/siem', icon: Terminal },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarCollapsed: isCollapsed } = useSelector((state: RootState) => state.ui);
  const [isHovered, setIsHovered] = useState(false);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebarCollapsed(true));
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const toggleSidebar = () => {
    dispatch(setSidebarCollapsed(!isCollapsed));
  };

  // Determine if the sidebar should be expanded for display
  const isExpanded = !isCollapsed || isHovered;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 flex h-full flex-col border-r border-border bg-card transition-all duration-300",
        isExpanded ? 'w-64' : 'w-16'
      )}
      onMouseEnter={() => !isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo and branding */}
      <div className={cn(
        "flex h-16 items-center border-b border-border px-4",
        isExpanded ? 'justify-between' : 'justify-center'
      )}>
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-dashguard-primary" />
          {isExpanded && (
            <span className="text-xl font-bold text-dashguard-primary">DashGuard</span>
          )}
        </div>
        
        {isExpanded && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col gap-2 px-2 pt-4">
        <div className="flex flex-col gap-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              isActive={location.pathname === link.href}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-1">
          {isExpanded && (
            <p className="px-4 py-1 text-xs font-semibold text-muted-foreground">
              MORE TOOLS
            </p>
          )}
          {moreLinks.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              isActive={location.pathname === link.href}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      </nav>

      {/* User section at bottom */}
      <div className="mt-auto p-2">
        <div className={cn(
          "flex items-center gap-3 rounded-md p-2 text-sm text-muted-foreground",
          isExpanded ? 'justify-start' : 'justify-center'
        )}>
          {isExpanded ? (
            <>
              <div className="h-8 w-8 rounded-full bg-dashguard-primary flex items-center justify-center text-white">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">Admin User</span>
                <span className="text-xs">Security Analyst</span>
              </div>
            </>
          ) : (
            <div className="h-8 w-8 rounded-full bg-dashguard-primary flex items-center justify-center text-white">
              A
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// Helper component for nav links
const NavLink = ({ 
  link, 
  isActive, 
  isExpanded 
}: { 
  link: SidebarLink; 
  isActive: boolean; 
  isExpanded: boolean;
}) => {
  const Icon = link.icon;
  
  return (
    <Link
      to={link.href}
      className={cn(
        "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-dashguard-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        !isExpanded && "justify-center px-0"
      )}
    >
      <Icon className={cn("h-5 w-5", isExpanded && "mr-3")} />
      {isExpanded && <span>{link.name}</span>}
    </Link>
  );
};

export default Sidebar;
