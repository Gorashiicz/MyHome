import type { SectionBackgroundKey } from "@/lib/section-backgrounds";
import { sectionBannerClass } from "@/lib/section-backgrounds";
import { cn } from "@/lib/utils";

type SectionBannerProps = {
  section: SectionBackgroundKey;
  title: string;
  description?: string;
  className?: string;
  compact?: boolean;
  children?: React.ReactNode;
};

export function SectionBanner({
  section,
  title,
  description,
  className,
  compact = false,
  children,
}: SectionBannerProps) {
  return (
    <header
      className={cn(
        sectionBannerClass(section),
        compact && "app-section-banner--compact",
        className
      )}
      data-section={section}
    >
      <div className="app-section-banner__overlay" aria-hidden />
      <div className="app-section-banner__content">
        <h1 className="app-section-banner__title">{title}</h1>
        {description && (
          <p className="app-section-banner__description">{description}</p>
        )}
        {children}
      </div>
    </header>
  );
}

/** Celostránkový hero pro landing / přihlášení. */
export function PageHero({
  section,
  title,
  description,
  children,
  className,
}: {
  section: SectionBackgroundKey;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("app-page-hero", sectionBannerClass(section), className)}
      data-section={section}
    >
      <div className="app-page-hero__overlay" aria-hidden />
      <div className="app-page-hero__content">
        <h1 className="app-page-hero__title">{title}</h1>
        {description && <p className="app-page-hero__description">{description}</p>}
        {children}
      </div>
    </div>
  );
}
