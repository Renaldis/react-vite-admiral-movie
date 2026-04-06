import { ReactNode, Suspense } from "react";
import { RouteObject } from "react-router";

/**
 * Recursively wraps route elements in Suspense with the nearest LoadingComponent.
 * Child routes inherit the closest ancestor LoadingComponent when they don't define one.
 */
export function applyRouteLoadingFallbacks(
  route: RouteObject,
  inheritedLoading?: React.ComponentType,
): void {
  const r = route as RouteObject & {
    LoadingComponent?: React.ComponentType;
    HydrateFallback?: React.ComponentType | null;
  };
  const EffectiveLoading = r.LoadingComponent || inheritedLoading;

  // Ensure Data Router pending states also use the nearest fallback
  if (!r.HydrateFallback && EffectiveLoading) {
    r.HydrateFallback = EffectiveLoading;
  }

  if (r.element && EffectiveLoading) {
    const child = r.element as ReactNode;
    r.element = <Suspense fallback={<EffectiveLoading />}>{child}</Suspense>;
  }

  if (r.children && r.children.length > 0) {
    r.children.forEach((childRoute) => applyRouteLoadingFallbacks(childRoute, EffectiveLoading));
  }
}
