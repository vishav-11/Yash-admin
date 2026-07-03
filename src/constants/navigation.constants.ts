import { ROUTES } from "./routes.constants";

export interface NavItem {
  label: string;
  href: string;
  icon: NavIconName;
  badge?: number;
  children?: NavItem[];
}

export interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

export type NavIconName =
  | "dashboard"
  | "photos"
  | "videos"
  | "logos"
  | "projects"
  | "videoProjects"
  | "settings"
  | "users"
  | "analytics";

export const NAVIGATION: NavGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: ROUTES.DASHBOARD.ROOT,
        icon: "dashboard",
      },
    ],
  },
  {
    groupLabel: "Media",
    items: [
      {
        label: "Photos",
        href: ROUTES.PHOTOS.ROOT,
        icon: "photos",
      },
      {
        label: "Videos",
        href: ROUTES.VIDEOS.ROOT,
        icon: "videos",
      },
      {
        label: "Logos",
        href: ROUTES.LOGOS.ROOT,
        icon: "logos",
      },
    ],
  },
  {
    groupLabel: "Projects",
    items: [
      {
        label: "All Projects",
        href: ROUTES.PROJECTS.ROOT,
        icon: "projects",
      },
      {
        label: "Video Projects",
        href: ROUTES.VIDEO_PROJECTS.ROOT,
        icon: "videoProjects",
      },
    ],
  },
];