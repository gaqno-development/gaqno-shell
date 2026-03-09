import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

const storage: Record<string, string> = {};
const localStorageMock = {
  getItem: (k: string) => storage[k] ?? null,
  setItem: (k: string, v: string) => { storage[k] = v; },
  removeItem: (k: string) => { delete storage[k]; },
  clear: () => { for (const key of Object.keys(storage)) delete storage[key]; },
  length: 0,
  key: () => null,
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, configurable: true });

vi.mock("@gaqno-development/frontcore/components/providers", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  QueryProvider: ({ children }: { children: React.ReactNode }) => children,
  I18nProvider: ({ children }: { children: React.ReactNode }) => children,
  AppProvider: ({ children }: { children: React.ReactNode }) => children,
  WhiteLabelProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@gaqno-development/frontcore/contexts", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  TenantProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@gaqno-development/frontcore/components/ui", () => ({
  ToastContainer: () => null,
  Toaster: () => null,
  SidebarInset: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SidebarProvider: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SidebarTrigger: () => React.createElement("button", null, "Toggle"),
  Avatar: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => React.createElement("span", null, children),
  AvatarImage: () => null,
  Breadcrumb: ({ children }: { children: React.ReactNode }) => React.createElement("nav", null, children),
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => React.createElement("span", null, children),
  BreadcrumbLink: ({ children }: { children: React.ReactNode }) => React.createElement("a", { href: "#" }, children),
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => React.createElement("ol", null, children),
  BreadcrumbPage: ({ children }: { children: React.ReactNode }) => React.createElement("span", null, children),
  BreadcrumbSeparator: () => React.createElement("span", null, "/"),
  Button: ({ children, loading, ...props }: Record<string, unknown>) =>
    React.createElement("button", { ...props, ...(loading === true ? { "data-loading": "true" } : {}) }, children),
  Separator: () => React.createElement("hr"),
  Card: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  CardContent: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  CardDescription: ({ children }: { children: React.ReactNode }) => React.createElement("p", null, children),
  CardHeader: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  CardTitle: ({ children }: { children: React.ReactNode }) => React.createElement("h2", null, children),
  CardFooter: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  Input: (props: Record<string, unknown>) => React.createElement("input", props),
  Form: ({ children }: { children: React.ReactNode }) => React.createElement("form", null, children),
  FormControl: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  FormField: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  FormItem: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  FormLabel: ({ children }: { children: React.ReactNode }) => React.createElement("label", null, children),
  FormMessage: () => null,
  Sheet: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SheetContent: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SheetHeader: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SheetTitle: ({ children }: { children: React.ReactNode }) => React.createElement("h2", null, children),
  Skeleton: () => React.createElement("div"),
  Badge: ({ children }: { children: React.ReactNode }) => React.createElement("span", null, children),
  Tabs: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  TabsList: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  TabsTrigger: ({ children, ...props }: Record<string, unknown>) => React.createElement("button", props, children),
  Checkbox: (props: Record<string, unknown>) => React.createElement("input", { type: "checkbox", ...props }),
  Collapsible: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  CollapsibleTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
    asChild ? children : React.createElement("button", null, children),
  Sidebar: ({ children }: { children: React.ReactNode }) => React.createElement("aside", null, children),
  SidebarContent: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => React.createElement("ul", null, children),
  SidebarMenuButton: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
    asChild ? children : React.createElement("button", null, children),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => React.createElement("li", null, children),
  SidebarMenuSub: ({ children }: { children: React.ReactNode }) => React.createElement("ul", null, children),
  SidebarMenuSubButton: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
    asChild ? children : React.createElement("button", null, children),
  SidebarMenuSubItem: ({ children }: { children: React.ReactNode }) => React.createElement("li", null, children),
  ChartContainer: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
  LoaderPinwheelIcon: () => React.createElement("span", null, "Loading"),
  Dialog: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DialogContent: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DialogHeader: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DialogTitle: ({ children }: { children: React.ReactNode }) => React.createElement("h2", null, children),
  DialogDescription: ({ children }: { children: React.ReactNode }) => React.createElement("p", null, children),
  DialogFooter: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DropdownMenu: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DropdownMenuTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
    asChild ? children : React.createElement("button", null, children),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DropdownMenuRadioGroup: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DropdownMenuRadioItem: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DropdownMenuItem: ({ children, asChild, onSelect }: { children: React.ReactNode; asChild?: boolean; onSelect?: (e: { preventDefault: () => void }) => void }) =>
    asChild ? children : React.createElement("button", { onClick: onSelect }, children),
  DropdownMenuSeparator: () => React.createElement("hr"),
  Progress: (props: Record<string, unknown>) => React.createElement("div", props),
  Pagination: ({ children }: { children: React.ReactNode }) => React.createElement("nav", null, children),
  PaginationContent: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  PaginationItem: ({ children }: { children: React.ReactNode }) => React.createElement("span", null, children),
  PaginationEllipsis: () => React.createElement("span", null, "..."),
  Table: ({ children }: { children: React.ReactNode }) => React.createElement("table", null, children),
  TableHeader: ({ children }: { children: React.ReactNode }) => React.createElement("thead", null, children),
  TableBody: ({ children }: { children: React.ReactNode }) => React.createElement("tbody", null, children),
  TableRow: ({ children }: { children: React.ReactNode }) => React.createElement("tr", null, children),
  TableHead: ({ children }: { children: React.ReactNode }) => React.createElement("th", null, children),
  TableCell: ({ children }: { children: React.ReactNode }) => React.createElement("td", null, children),
  DataTable: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  DataTableColumnHeader: ({ title }: { title: string }) => React.createElement("span", null, title),
}));

vi.mock("@gaqno-development/frontcore/components/layout", () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
  MobileBottomNav: () => null,
}));

vi.mock("@gaqno-development/frontcore/hooks", () => ({
  useAuth: () => ({
    user: { id: "1", email: "test@test.com" },
    profile: { name: "Test", avatar_url: null },
    loading: undefined,
    signOut: vi.fn(),
  }),
  useFilteredMenu: () => [],
  useIsMobile: () => false,
  useWhiteLabel: () => ({ config: null }),
  useOmnichannelDrawer: () => ({
    isOpen: false,
    setOpen: vi.fn(),
    conversationId: null,
    customerId: null,
  }),
}));

vi.mock("@gaqno-development/frontcore/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "1", email: "test@test.com" },
    profile: { name: "Test", avatar_url: null },
    loading: undefined,
    signOut: vi.fn(),
  }),
}));

vi.mock("@gaqno-development/frontcore/hooks/auth/useSsoAuth", () => ({
  useSignIn: () => ({ mutate: vi.fn(), isPending: false }),
  useSignUp: () => ({ mutate: vi.fn(), isPending: false }),
  useMe: () => ({
    data: { user: { firstName: "Test", lastName: "User" } },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    enabled: true,
  }),
}));

vi.mock("@gaqno-development/frontcore/hooks/useUserPermissions", () => ({
  useUserPermissions: () => ({ permissions: ["platform.all"], isLoading: false }),
}));

vi.mock("@gaqno-development/frontcore/utils/api", () => ({
  ssoClient: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock("@gaqno-development/frontcore/utils/api/sso-client", () => ({
  ssoAxiosClient: { patch: vi.fn().mockResolvedValue({ data: {} }) },
}));

const uiStoreMockState = {
  sidebarOpen: false,
  setSidebarOpen: vi.fn(),
  omnichannelUnreadCount: 0,
  incrementOmnichannelUnread: vi.fn(),
  setOmnichannelUnreadCount: vi.fn(),
  resetOmnichannelUnread: vi.fn(),
  shellNotifications: [] as unknown[],
  addShellNotification: vi.fn(),
  markAllShellNotificationsRead: vi.fn(),
  clearShellNotifications: vi.fn(),
};
vi.mock("@gaqno-development/frontcore/store/uiStore", () => ({
  useUIStore: (selector?: (s: typeof uiStoreMockState) => unknown) =>
    selector ? selector(uiStoreMockState) : uiStoreMockState,
}));

vi.mock("@gaqno-development/frontcore/i18n", () => ({
  useTranslation: () => ({ t: (key: string, fallback?: string) => fallback ?? key, i18n: { changeLanguage: vi.fn(), on: vi.fn(), off: vi.fn(), language: "en" } }),
  I18nProvider: ({ children }: { children: React.ReactNode }) => children,
  i18n: { changeLanguage: vi.fn(), on: vi.fn(), off: vi.fn(), language: "en" },
  broadcastLanguageChange: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: "/dashboard", key: "1" }),
    useRouteError: () => null,
    useSearchParams: () => [new URLSearchParams()],
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => React.createElement("a", { href: to }, children),
    Navigate: () => null,
  };
});

vi.mock("socket.io-client", () => ({ default: vi.fn() }));

vi.mock("@gaqno-development/frontcore/utils", () => ({
  getIconComponent: () => () => null,
}));

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: { div: ({ children, ...p }: Record<string, unknown>) => React.createElement("div", p, children) },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => (opts?.count != null ? `${key}_${opts.count}` : key),
    i18n: { changeLanguage: vi.fn() },
  }),
}));

vi.mock("@gaqno-development/frontcore/config/service-urls", () => ({
  getServiceName: (pathname: string) => pathname.split("/")[1] || "service",
  SERVICE_ROUTE_MAP: { "/crm": true, "/erp": true },
}));

vi.mock("@gaqno-development/frontcore/lib/constants", () => ({
  ROUTES: { DASHBOARD: "/dashboard" },
}));

const IconMock = () => React.createElement("span", null, "icon");
vi.mock("@gaqno-development/frontcore/components/icons", () => ({
  LayoutDashboard: IconMock,
  TrendingUp: IconMock,
  Package: IconMock,
  ClipboardList: IconMock,
  DollarSign: IconMock,
  BarChart3: IconMock,
  ShieldCheck: IconMock,
  Sparkles: IconMock,
  Music: IconMock,
  Image: IconMock,
  Video: IconMock,
  Database: IconMock,
  ShoppingBag: IconMock,
  Share2: IconMock,
  Network: IconMock,
  ShoppingCart: IconMock,
  Warehouse: IconMock,
  GearIcon: IconMock,
  TargetIcon: IconMock,
  UsersIcon: IconMock,
  AnimatedLightbulbIcon: IconMock,
  BookIcon: IconMock,
  AnimatedBellIcon: IconMock,
  AnimatedDicesIcon: IconMock,
  AnimatedGearIcon: IconMock,
  AnimatedShoppingCartIcon: IconMock,
  AnimatedSparklesIcon: IconMock,
  AnimatedTrendingUpIcon: IconMock,
  BoxesIcon: IconMock,
  DollarSignIcon: IconMock,
  FileDescriptionIcon: IconMock,
  LayoutPanelTopIcon: IconMock,
}));

vi.mock("@gaqno-development/frontcore/hooks/admin/useUsers", () => ({
  useUsers: () => ({ data: [], isLoading: false }),
}));

vi.mock("@gaqno-development/frontcore/hooks/admin/useTenants", () => ({
  useTenants: () => ({ data: [], isLoading: false }),
}));

vi.mock("@gaqno-development/frontcore/hooks/admin/useTenantCosts", () => ({
  useTenantCosts: () => ({ data: null, isLoading: false }),
}));

vi.mock("@gaqno-development/frontcore/hooks/admin/useDomains", () => ({
  useDomains: () => ({ domains: [], isLoading: false, checkSsl: vi.fn() }),
}));

vi.mock("recharts", () => {
  const Label = ({ content }: { content?: (args: { viewBox?: { cx?: number; cy?: number } }) => React.ReactNode }) => {
    if (typeof content === "function") {
      const viewBox = { cx: 0, cy: 0 };
      return React.createElement("div", null, content({ viewBox }));
    }
    return null;
  };
  return {
    AreaChart: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
    Area: () => null,
    BarChart: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
    LineChart: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
    Line: () => null,
    Legend: () => null,
    Cell: () => null,
    PieChart: ({ children }: { children: React.ReactNode }) => React.createElement("div", null, children),
    Pie: () => null,
    Label,
  };
});
