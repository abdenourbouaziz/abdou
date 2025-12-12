"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { Link } from "@/i18n/navigation";

const LABEL_KEYS = {
  categories: "categories",
  checkout: "checkout",
} as const;

type LabelKey = (typeof LABEL_KEYS)[keyof typeof LABEL_KEYS];

export default function Breadcrumbs() {
  const locale = useLocale();
  const t = useTranslations("breadcrumbs");
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const routeSegments = segments[0] === locale ? segments.slice(1) : segments;

  const crumbs = routeSegments.map((segment, index) => {
    const href = `/${routeSegments.slice(0, index + 1).join("/")}`;
    const labelKey: LabelKey | null =
      segment in LABEL_KEYS ? LABEL_KEYS[segment as keyof typeof LABEL_KEYS] : null;

    return {
      href,
      label: labelKey ? t(labelKey) : segment,
      isLast: index === routeSegments.length - 1,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-foreground/70">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-foreground">
            {t("home")}
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span className="opacity-50">/</span>
            {crumb.isLast ? (
              <span className="text-foreground">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
