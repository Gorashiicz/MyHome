import type { SectionBackgroundKey } from "@/lib/section-backgrounds";
import { cn } from "@/lib/utils";

type SectionPageProps = {
  section: SectionBackgroundKey;
  title: string;
  description?: string;
  className?: string;
  bodyClassName?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
};

/** Stránka s výrazným ilustračním pruhem nahoře a obsahem pod ním. */
export function SectionPage({
  section,
  title,
  description,
  className,
  bodyClassName,
  headerExtra,
  children,
}: SectionPageProps) {
  return (
    <div className={cn("app-section-page", className)}>
      <div className="app-section-hero" data-section={section}>
        <div className="app-section-hero__art" aria-hidden />
        <div className="app-section-hero__bar">
          <div className="min-w-0 flex-1">
            <h1 className="app-section-hero__title">{title}</h1>
            {description && (
              <p className="app-section-hero__description">{description}</p>
            )}
          </div>
          {headerExtra && (
            <div className="app-section-hero__actions shrink-0">{headerExtra}</div>
          )}
        </div>
      </div>
      <div className={cn("app-section-page__body space-y-4", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}

/** @deprecated Použijte SectionPage. */
export function SectionBanner(props: SectionPageProps) {
  return <SectionPage {...props} />;
}

/** Úvodní obrazovka nebo přihlášení — větší hero s ilustrací. */
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
    <div className={cn("app-section-page", className)}>
      <div className="app-section-hero app-section-hero--landing" data-section={section}>
        <div className="app-section-hero__art app-section-hero__art--landing" aria-hidden />
        <div className="app-section-hero__bar app-section-hero__bar--landing">
          <h1 className="app-section-hero__title app-section-hero__title--landing">
            {title}
          </h1>
          {description && (
            <p className="app-section-hero__description app-section-hero__description--landing">
              {description}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="app-section-page__body app-section-page__body--landing">
          {children}
        </div>
      )}
    </div>
  );
}
