import { createNavigation } from "next-intl/navigation";

import { defaultLocale, locales } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    defaultLocale,
    localePrefix: "always",
  });
