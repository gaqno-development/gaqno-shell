import { useTranslation } from "@gaqno-development/frontcore/i18n";
import { Lightbulb } from "lucide-react";

export default function IntelligencePlaceholder() {
  const { t } = useTranslation("navigation");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12">
      <div className="rounded-full bg-amber-500/10 p-4">
        <Lightbulb className="h-10 w-10 text-amber-500" />
      </div>
      <h1 className="text-2xl font-semibold">
        {t("menu.intelligence", "Inteligência")}
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        {t(
          "intelligence.comingSoon",
          "Análises, previsões e insights estarão disponíveis em breve."
        )}
      </p>
    </div>
  );
}
