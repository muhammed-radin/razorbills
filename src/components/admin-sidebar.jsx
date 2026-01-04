import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Tags,
  FileText,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useEffect } from "react"

const navItems = {
  main: {
    label: "Main Navigation",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: Package,
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        url: "/admin/customers",
        icon: Users,
      }]
  },
  quick: {
    label: "Quick Actions",
    items: [
      {
        title: "New Product",
        url: "/admin/products/new",
        icon: Package,
      },
    ]
  }
};

const navItemsArray = [...Object.values(navItems).flatMap(group => group.items)];



export function AdminSidebar({ collapsible, variant, side, savePageInfo, ...props }) {
  const location = useLocation();
  const navItemsKeys = Object.keys(navItems);

  // Update page info when location changes
  useEffect(() => {
    const currentNav = navItemsArray.find(item => item.url === location.pathname)
    if (currentNav) {
      savePageInfo(currentNav)
    }
  }, [location.pathname, savePageInfo])

  return (
    <Sidebar collapsible={collapsible} variant={variant} side={side} {...props} >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Admin Panel</span>
            <span className="text-xs text-muted-foreground">Razorbills</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navItemsKeys.map((key) => {
          const group = navItems[key];
          console.log(group);


          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.url;

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>)
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@razorbills.com</span>
            </div>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
