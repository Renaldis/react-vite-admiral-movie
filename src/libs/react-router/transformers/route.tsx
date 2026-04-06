import { JSX, LazyExoticComponent } from "react";
import { ActionFunction, LoaderFunction } from "react-router";
import { DEFAULT_FALLBACK, ExtendedRouteObject, PATH_SEPARATOR } from "../types/route";
import { isDynamicRoute, isRouteGroup } from "../utils/path";

function joinIds(parentId: string | undefined, childId: string | undefined): string | undefined {
  if (!childId) return parentId;

  const trimmedParent = parentId && parentId !== "/" ? parentId.replace(/\/+$/, "") : "";
  const trimmedChild = childId.replace(/^\/+/, "");

  if (!trimmedParent) return trimmedChild;

  return `${trimmedParent}/${trimmedChild}`;
}

/**
 * Creates a new route configuration based on path segments and components.
 */
export function createRoute(args: {
  segments: string[];
  parentId?: string;
  PageComponent: LazyExoticComponent<() => JSX.Element>;
  LoadingComponent?: LazyExoticComponent<() => JSX.Element>;
  loader?: LoaderFunction;
  action?: ActionFunction;
  guard?: () => Promise<boolean>;
}): ExtendedRouteObject {
  const [current, ...rest] = args.segments;
  const [rawPath, pageType] = current.split(PATH_SEPARATOR);
  const isGroupSegment = isRouteGroup(rawPath);
  const cleanPath = isGroupSegment ? undefined : rawPath;
  const currentKey = rawPath || "root";
  const composedId = isGroupSegment ? joinIds(args.parentId, currentKey) : undefined;

  const route: ExtendedRouteObject = cleanPath ? { path: cleanPath } : {};

  if (isGroupSegment) {
    route.id = composedId;
  }

  // Handle page or layout routes
  if (pageType === "page" || pageType === "layout") {
    const FallbackComponent = args.LoadingComponent || DEFAULT_FALLBACK;

    route.element = <args.PageComponent />;
    route.HydrateFallback = FallbackComponent;
    route.LoadingComponent = FallbackComponent;

    route.action = args.action;
    route.loader = args.loader;

    route.handle = { pageType: pageType };
  }

  if (rest.length > 0) {
    const nextParentId = isGroupSegment ? composedId : joinIds(args.parentId, cleanPath || rawPath);

    handleNestedRoutes(route, rest, { ...args, parentId: nextParentId });
  }

  return route;
}

/**
 * Handle nested route creation
 */
function handleNestedRoutes(
  route: ExtendedRouteObject,
  rest: string[],
  args: {
    segments: string[];
    parentId?: string;
    PageComponent: LazyExoticComponent<() => JSX.Element>;
    LoadingComponent?: LazyExoticComponent<() => JSX.Element>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    guard?: () => Promise<boolean>;
  },
): void {
  const nextSegment = rest[0].split(PATH_SEPARATOR)[0];
  const cleanPath = route.path || "";

  if (isDynamicRoute(cleanPath)) {
    route.children = route.children || [];
    route.children.push(createNestedRoute(nextSegment, args));
    return;
  }

  const childRoute = createRoute({ ...args, segments: rest });
  route.children = route.children || [];

  route.children.push(childRoute);
}

/**
 * Creates a nested edit/update route for a dynamic parameter
 */
export function createNestedRoute(
  editSegment: string,
  args: {
    PageComponent: LazyExoticComponent<() => JSX.Element>;
    LoadingComponent?: LazyExoticComponent<() => JSX.Element>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    guard?: () => Promise<boolean>;
  },
): ExtendedRouteObject {
  const FallbackComponent = args.LoadingComponent || DEFAULT_FALLBACK;

  return {
    path: editSegment,
    element: <args.PageComponent />,
    HydrateFallback: FallbackComponent,
    action: args.action,
    loader: args.loader,
    handle: { pageType: "page" },
  };
}
