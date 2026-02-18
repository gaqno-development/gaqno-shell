import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@gaqno-development/frontcore/hooks";
import { useFilteredMenu } from "@gaqno-development/frontcore/hooks";
import { useIsMobile } from "@gaqno-development/frontcore/hooks";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";

const AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/ai",
  "/crm",
  "/erp",
  "/finance",
  "/pdv",
  "/admin",
  "/sso",
  "/rpg",
  "/omnichannel",
];

const PUBLIC_ROUTES = ["/login", "/register", "/"];

const MICRO_FRONTEND_ROUTES = [
  "/ai",
  "/crm",
  "/erp",
  "/finance",
  "/pdv",
  "/rpg",
  "/admin",
  "/sso",
  "/omnichannel",
];

function shouldShowDashboardLayout(pathname: string): boolean {
  if (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return false;
  }
  return AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route));
}

function isMicroFrontendRoute(pathname: string): boolean {
  return MICRO_FRONTEND_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthenticatedRoute(pathname: string): boolean {
  return AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route));
}

function getTransitionKey(pathname: string, locationKey: string): string {
  if (isMicroFrontendRoute(pathname)) {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    return (firstSegment ?? pathname) || locationKey;
  }
  return locationKey;
}

export function useShellLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const [shouldShowLayout, setShouldShowLayout] = useState(false);
  const [isMicroFrontend, setIsMicroFrontend] = useState(false);
  const menuItems = useFilteredMenu();
  const transitionKey = getTransitionKey(pathname, location.key);

  useEffect(() => {
    const isMFE = isMicroFrontendRoute(pathname);
    const showLayout =
      shouldShowDashboardLayout(pathname) && !loading && !!user;
    setShouldShowLayout(showLayout);
    setIsMicroFrontend(isMFE);
  }, [pathname, loading, user]);

  useEffect(() => {
    if (!loading && !user && isAuthenticatedRoute(pathname)) {
      navigate("/login");
    }
  }, [loading, user, pathname, navigate]);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);

  const pageTransition = {
    initial: { opacity: 0, x: 8 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -8 },
    transition: { duration: 0.2 },
  };

  return {
    shouldShowLayout,
    isMicroFrontend,
    transitionKey,
    menuItems,
    pageTransition,
  };
}
