import { ComponentType, JSX } from "react";
import {
  ActionFunction,
  IndexRouteObject,
  LoaderFunction,
  NonIndexRouteObject,
  RouteObject,
} from "react-router";

/**
 * Represents the expected structure of a page module's exports.
 */
export interface PageModuleExports {
  default: () => JSX.Element;
  permissions?: string[] | string[][];
  loader?: LoaderFunction;
  action?: ActionFunction;
}

/**
 * Defines the type of page in the routing system.
 */
export interface RouteHandle {
  pageType: "page" | "layout";
}

type RouteExtrasBase = {
  handle?: RouteHandle;
  HydrateFallback?: ComponentType | null;
  LoadingComponent?: ComponentType | null;
};

type ExtendedIndexRouteObject = Omit<IndexRouteObject, "handle"> &
  RouteExtrasBase & {
    index: true;
    children?: undefined;
  };

type ExtendedNonIndexRouteObject = Omit<NonIndexRouteObject, "handle"> &
  RouteExtrasBase & {
    children?: ExtendedRouteObject[];
    index?: false | undefined;
  };

/**
 * Extends the base RouteObject to include additional properties while keeping
 * the index/route discriminated union compatible with react-router's types.
 */
export type ExtendedRouteObject = ExtendedIndexRouteObject | ExtendedNonIndexRouteObject;

export type PageModule = () => Promise<PageModuleExports>;
export type LoadingModule = () => Promise<{ default: () => JSX.Element }>;
export type RouteUpdater = (route: RouteObject) => RouteObject;

export const PATH_SEPARATOR = "\\";
export const DEFAULT_FALLBACK = () => <div>Loading...</div>;
