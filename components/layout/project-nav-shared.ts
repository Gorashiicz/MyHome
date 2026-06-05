import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Wallet,
  FileText,
  Plus,
  MoreHorizontal,
} from "lucide-react";

export const VICE_PREFIXES = [
  "/vice",
  "/fotky",
  "/ukoly",
  "/denik",
  "/dodavatele",
  "/vady",
  "/checklisty",
  "/milniky",
  "/sdileni",
  "/nastaveni",
];

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function getProjectNavItems(base: string): NavItem[] {
  return [
    { href: base, label: "Přehled", icon: LayoutDashboard },
    { href: `${base}/pridat`, label: "Přidat", icon: Plus },
    { href: `${base}/rozpocet`, label: "Rozpočet", icon: Wallet },
    { href: `${base}/dokumenty`, label: "Dokumenty", icon: FileText },
    { href: `${base}/vice`, label: "Více", icon: MoreHorizontal },
  ];
}

export function isNavItemActive(pathname: string, href: string, base: string) {
  if (href === base) {
    return pathname === base;
  }
  if (href === `${base}/vice`) {
    return VICE_PREFIXES.some((prefix) =>
      pathname.startsWith(`${base}${prefix}`)
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Stejný výrazný styl pro všechny položky navigace. */
export function navItemClasses(active: boolean) {
  return active ? "app-nav-item app-nav-item--active" : "app-nav-item";
}

export function navIconClasses(active: boolean) {
  return active ? "app-nav-icon app-nav-icon--active" : "app-nav-icon";
}
