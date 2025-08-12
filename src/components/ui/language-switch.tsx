"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitch() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: "en", name: t("english") },
    { code: "zh", name: t("chinese") },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale prefix from pathname
    const pathWithoutLocale =
      pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {currentLanguage?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-24">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              locale === language.code ? "bg-gray-100" : ""
            }`}
          >
            <span>{language.name}</span>
            {locale === language.code && (
              <span className="ml-auto text-xs text-gray-500">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
