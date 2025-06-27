import { ChevronUp } from "lucide-react"
import * as React from "react"

import ClientsIcon from "@/components/icons/clients-icon"
import OverviewIcon from "@/components/icons/overview-icon"
import SidebarSubmenuIcon from "@/components/icons/sidebar-submenu-icon"
import TodoIcon from "@/components/icons/todo-icon"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import LogoText from "@/components/common/logo-text"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      isActive: true,
      icon: () => <OverviewIcon />,
      items: []
    },
    {
      title: "My Clients",
      isActive: true,
      url: "/dashboard/patients",
      icon: () => <ClientsIcon />,
      items: [
        {
          title: "Akash Singh",
          url: "#"
        },
        {
          title: "Vaibhav Kumar",
          url: "#"
        },
        {
          title: "Piyush Raj",
          url: "#"
        },
        {
          title: "Nitesh Rajput",
          url: "#"
        }
      ]
    },
    {
      title: "Todo List",
      url: "/dashboard/todo",
      isActive: true,
      icon: () => <TodoIcon />,
      items: [
        {
          title: "Create Treatment Plan",
          url: "#"
        },
        {
          title: "Generate Notes",
          url: "#"
        },
        {
          title: "Make New Report",
          url: "#"
        },
        {
          title: "Client 2 Plan",
          url: "#"
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className=" p-4 z-50  bg-cover bg-center">
      <SidebarHeader className="mb-12">
        <SidebarMenu>
          <SidebarMenuItem className="mx-auto">
            <LogoText />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <Link href={item.url}>
                      <SidebarMenuButton className="text-black-heading ">
                        <item.icon />
                        {item.title}{" "}
                        <ChevronUp className="ml-auto !size-4 group-data-[state=open]/collapsible:rotate-0 transition-all group-data-[state=closed]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </Link>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub >
                        {item.items.map((item) => (
                          <SidebarMenuSubItem className="flex items-center -ml-px" key={item.title}>
                            <SidebarSubmenuIcon />
                            <SidebarMenuSubButton
                              asChild
                            >
                              <a href={item.url}>
                                {item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
