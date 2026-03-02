import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@gaqno-development/frontcore/hooks";
import { useFilteredMenu } from "@gaqno-development/frontcore/hooks";
import { useIsMobile } from "@gaqno-development/frontcore/hooks";
import { useUIStore } from "@gaqno-development/frontcore/store/uiStore";
import { SHELL_MENU_ITEMS } from "@/config/shell-menu";

const MFE_ROUTES = [
  "/ai",
  "/crm",
  "/erp",
  "/finance",
  "/pdv",
  "/rpg",
  "/admin",
  "/sso",
  "/omnichannel",
  "/wellness",
  "/saas",
];
const LAYOUT_ROUTES = ["/dashboard", ...MFE_ROUTES];
const PUBLIC_ROUTES = ["/login", "/register", "/"];
const STANDALONE_DEMO_ROUTES = [
  "/application-shell-01",
  "/dashboard-shell-01",
];

function pathUnderRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(route + "/");
}

function shouldShowShellLayout(pathname: string): boolean {
  if (PUBLIC_ROUTES.some((r) => pathUnderRoute(pathname, r))) return false;
  if (STANDALONE_DEMO_ROUTES.some((r) => pathUnderRoute(pathname, r)))
    return false;
  return LAYOUT_ROUTES.some((r) => pathname.startsWith(r));
}

function isMicroFrontendRoute(pathname: string): boolean {
  return MFE_ROUTES.some((r) => pathname.startsWith(r));
}

function isAuthenticatedRoute(pathname: string): boolean {
  return LAYOUT_ROUTES.some((r) => pathname.startsWith(r));
}

function getTransitionKey(pathname: string, locationKey: string): string {
  if (isMicroFrontendRoute(pathname)) {
    const segment = pathname.split("/").filter(Boolean)[0];
    return segment ?? locationKey;
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
  const backendMenu = useFilteredMenu();
  const menuItems = useMemo(
    () => (backendMenu.length > 0 ? backendMenu : SHELL_MENU_ITEMS),
    [backendMenu]
  );
  const transitionKey = getTransitionKey(pathname, location.key);

  useEffect(() => {
    const isMFE = isMicroFrontendRoute(pathname);
    const showLayout =
      shouldShowShellLayout(pathname) && !loading && !!user;
    // #region agent log
    (function _dbg() {
      const payload = { sessionId: 'd5bf67', location: 'useShellLayout.ts:effect', message: 'useShellLayout effect', data: { pathname, loading, hasUser: !!user, showLayout, shouldShowShellLayoutPath: shouldShowShellLayout(pathname) }, timestamp: Date.now(), hypothesisId: 'E' };
      console.debug('[debug-d5bf67]', payload);
      try { fetch('http://127.0.0.1:7576/ingest/71308206-a154-49e9-9e17-2126d2469326', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'd5bf67' }, body: JSON.stringify(payload) }).catch(() => {}); } catch (_) {}
    })();
    // #endregion
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
