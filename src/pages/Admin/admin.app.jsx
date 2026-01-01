import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { ThemeProvider } from "@/utils/theme-provider"
import { createContext, useState } from "react"
import { LayoutDashboard } from "lucide-react"

const PageInfoContext = createContext();

function AdminApp() {
  const [currentPageInfo, setCurrentPageInfo] = useState({
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  });

  return (
    <ThemeProvider>
      <PageInfoContext.Provider value={currentPageInfo}>
        <SidebarProvider defaultOpen >
          <AdminSidebar variant="sidebar" collapsible="none" className="h-screen" savePageInfo={setCurrentPageInfo} />
          <SidebarInset className="flex flex-col relative overflow-auto h-screen">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Admin {currentPageInfo.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div>
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </PageInfoContext.Provider>
    </ThemeProvider>
  );
}

export default AdminApp;
export { PageInfoContext };