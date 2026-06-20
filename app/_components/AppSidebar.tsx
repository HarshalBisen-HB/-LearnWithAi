import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  Inbox,
  Layers,
  Search,
  Settings,
  UserCircle,
  Wallet,
  FileStack,
  MessageSquareCode,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Layers,
  },
  {
    title: "AI Tools",
    url: "/ai-tools",
    icon: Inbox,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: FileStack,
  },
  {
    title: "My History",
    url: "/my-history",
    icon: Calendar,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: Wallet,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserCircle,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: MessageSquareCode,
  },
];

export function AppSidebar() {
  const path = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <Image
            src="/we2.svg"
            alt="logo"
            width={100}
            height={100}
            className="w-full"
          />
          <h2 className="text-md text-gray-400 text-center">
            Create-Automate-Accelerate
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {items.map((item, index) => (
                // <SidebarMenuItem key={item.title} className='p-2'>
                //     <SidebarMenuButton asChild className=''>
                <a
                  href={item.url}
                  key={index}
                  className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-[#dae1ff] rounded-lg ${path.includes(item.url) && "bg-gray-200ß"}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
                //     </SidebarMenuButton>
                // </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <h2 className="p-2 text-gray-400 text-sm">Copyright @SidhantSingh</h2>
      </SidebarFooter>
    </Sidebar>
  );
}
