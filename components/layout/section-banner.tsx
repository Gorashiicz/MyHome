import type { SectionBackgroundKey } from "@/lib/section-backgrounds";
import { cn } from "@/lib/utils";

type SectionPageProps = {
  section: SectionBackgroundKey;
  title: string;
  description?: string;
  className?: string;
  bodyClassName?: string;
  inset?: boolean;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
};

/** Stránka s celoplošným tematickým pozadím a skleněnými kartami. */
export function SectionPage({
  section,
  title,
  description,
  className,
  bodyClassName,
  inset = false,
  headerExtra,
  children,
}: SectionPageProps) {
  return (
    <div
      className={cn(
        "app-page-backdrop",
        inset && "app-page-backdrop--inset",
        className
      )}
      data-section={section}
    >
      <div className="app-page-backdrop__scrim" aria-hidden />
      <div className="app-page-backdrop__inner">
        <header className="app-page-backdrop__header">
          <div className="min-w-0 flex-1">
            <h1 className="app-page-backdrop__title">{title}</h1>
            {description && (
              <p className="app-page-backdrop__description">{description}</p>
            )}
          </div>
          {headerExtra && (
            <div className="app-page-backdrop__header-extra shrink-0">
              {headerExtra}
            </div>
          )}
        </header>
        <div className={cn("app-page-backdrop__body space-y-4", bodyClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** @deprecated Použijte SectionPage. */
export function SectionBanner(props: SectionPageProps) {
  return <SectionPage {...props} />;
}

/** Celostránkový úvod (landing, přihlášení). */
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
      className={cn("app-page-backdrop app-page-backdrop--hero", className)}
      data-section={section}
    >
      <div className="app-page-backdrop__scrim app-page-backdrop__scrim--hero" aria-hidden />
      <div className="app-page-backdrop__inner app-page-backdrop__inner--hero">
        <h1 className="app-page-backdrop__title app-page-backdrop__title--hero">
          {title}
        </h1>
        {description && (
          <p className="app-page-backdrop__description app-page-backdrop__description--hero">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
