import React from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  FacebookIcon,
  InstagramIcon,
  LanguagesIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";

import { AppSidebar } from "@gaqno-development/frontcore/components/layout";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@gaqno-development/frontcore/components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@gaqno-development/frontcore/components/ui";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Separator } from "@gaqno-development/frontcore/components/ui";

import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";
import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";
import { MicroFrontendErrorBoundary } from "@/components/microfrontend-error-boundary";

type AppSidebarProps = React.ComponentProps<typeof AppSidebar>;
type MenuItems = AppSidebarProps["customMenuItems"];

export type ApplicationShellLayoutProps = {
  menuItems?: MenuItems;
  transitionKey: string;
  pageTransition: {
    initial: object;
    animate: object;
    exit: object;
    transition: object;
  };
};

export function ApplicationShellLayout({
  menuItems,
  transitionKey,
  pageTransition,
}: ApplicationShellLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const open = sidebarOpen;
  const defaultOpen = sidebarOpen;
  const onOpenChange = (next: boolean) => setSidebarOpen(next);

  return (
    <SidebarProvider
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <div className="flex min-h-dvh w-full overflow-hidden">
        <AppSidebar customMenuItems={menuItems} />
        <SidebarInset className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="bg-card sticky top-0 z-50 border-b">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="[&_svg]:!size-5" />
                <Separator
                  orientation="vertical"
                  className="hidden !h-4 sm:block"
                />
                <Breadcrumb className="hidden sm:block">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Free</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-1.5">
                <LanguageDropdown
                  trigger={
                    <Button variant="ghost" size="icon">
                      <LanguagesIcon />
                    </Button>
                  }
                />
                <ProfileDropdown
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9.5"
                    >
                      <Avatar className="size-9.5 rounded-md">
                        <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
              </div>
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-auto bg-background">
            <MicroFrontendErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={transitionKey}
                  initial={pageTransition.initial}
                  animate={pageTransition.animate}
                  exit={pageTransition.exit}
                  transition={pageTransition.transition}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </MicroFrontendErrorBoundary>
          </main>
          <footer>
            <div className="text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
              <p className="text-sm text-balance max-sm:text-center">
                {`©${new Date().getFullYear()}`}{" "}
                <a href="#" className="text-primary">
                  shadcn/studio
                </a>
                , Made for better web design
              </p>
              <div className="flex items-center gap-5">
                <a href="#">
                  <FacebookIcon className="size-4" />
                </a>
                <a href="#">
                  <InstagramIcon className="size-4" />
                </a>
                <a href="#">
                  <LinkedinIcon className="size-4" />
                </a>
                <a href="#">
                  <TwitterIcon className="size-4" />
                </a>
              </div>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
