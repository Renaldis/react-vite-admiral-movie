import { ActionFunction, LoaderFunction } from "react-router";
import { PageModuleExports } from "../types/route";
import { withMiddleware } from "../utils/middleware";
import { SessionUser } from "../../localstorage";

/**
 * Creates a loader function for a route that first checks permissions via middleware.
 */
export function createLoaderFunction(importer: () => Promise<unknown>): LoaderFunction {
  return withMiddleware(async (middlewareArgs) => {
    const pageModule = (await importer()) as PageModuleExports;
    if (pageModule.permissions && pageModule.permissions.length > 0) {

      const session = SessionUser.get();
      const userPermissions = new Set(
        session?.user?.roles?.flatMap((role) => role.permissions.map((p) => p.key)) || [],
      );

      const requiredPermissions = pageModule.permissions;
      let hasPermission = false;

      // Check if it's 2D array (OR of ANDs)
      if (
        requiredPermissions.length > 0 &&
        Array.isArray(requiredPermissions[0])
      ) {
        // permissions: string[][] -> OR logic for outer arrays
        // Each inner array is AND logic
        const permissionGroups = requiredPermissions as string[][];
        hasPermission = permissionGroups.some((group) =>
          group.every((p) => userPermissions.has(p)),
        );
      } else {
        // permissions: string[] -> AND logic
        const permissions = requiredPermissions as string[];
        hasPermission = permissions.every((p) => userPermissions.has(p));
      }

      if (!hasPermission) {
        throw new Response("Forbidden", { status: 403 });
      }
    }

    return pageModule.loader?.(middlewareArgs)
  });
}

/**
 * Creates an action function for a route.
 */
export function createActionFunction(importer: () => Promise<unknown>): ActionFunction {
  return async (args) => {
    const result = (await importer()) as PageModuleExports;
    return result.action ? result.action(args) : null;
  };
}
