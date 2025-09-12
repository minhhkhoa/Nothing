"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, locales } from "../../config";
import { setUserLocale } from "@/lib/locale";
import { useLocale, useTranslations } from "next-intl";

export default function SwitchLanguage() {
  const SwitchLanguageTrans = useTranslations("SwitchLanguage");
  const locale = useLocale();

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        setUserLocale(value as Locale);
      }}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={SwitchLanguageTrans("title")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((locale) => (
            <SelectItem value={locale} key={locale}>
              {SwitchLanguageTrans(locale)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
