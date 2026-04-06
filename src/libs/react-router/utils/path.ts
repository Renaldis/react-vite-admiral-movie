import { PATH_SEPARATOR } from "../types/route";

export const GROUP_PREFIX = "GROUP:";

/**
 * Processes a file path to generate route segments, handling various routing patterns.
 *
 * @param filePath - The file path to process
 * @param transformer - Optional function to transform segment names
 * @returns Array of processed route segments
 */
export function getRouteSegmentsFromFilePath(
  filePath: string,
  transformer?: (segment: string, prevSegment: string) => string,
): string[] {
  const defaultTransformer = (segment: string, prevSegment: string): string =>
    `${prevSegment}${PATH_SEPARATOR}${segment.split(".")[0]}`;

  const actualTransformer = transformer || defaultTransformer;

  const parsedSegments = filePath
    .replace("/app", "")
    .split("/")
    .filter((segment) => !segment.startsWith("(index)") && !segment.startsWith("_"))
    .map((segment) => parseSegment(segment));

  const fileSegment = parsedSegments.pop();
  if (!fileSegment) return [];

  const normalizedSegments = normalizeRouteSegments(parsedSegments);

  const lastSegment = normalizedSegments.pop() || "";
  const finalSegment = actualTransformer(fileSegment, lastSegment);

  return [...normalizedSegments, finalSegment];
}

/**
 * Parse a file path segment and convert it to a route path segment
 */
function parseSegment(segment: string): string {
  if (segment.startsWith(".")) return "/";
  if (segment.startsWith("(")) return `${GROUP_PREFIX}${segment.replace(/[()]/g, "")}`;
  if (segment.startsWith("[...")) return "*";
  if (segment.startsWith("[")) return segment.replace("[", ":").replace("]", "");
  return segment;
}

function normalizeRouteSegments(segments: string[]): string[] {
  return segments.reduce<string[]>((acc, segment) => {
    const previous = acc[acc.length - 1];
    const isDynamic = segment.startsWith(":");
    const shouldMergeWithPrevious = isDynamic && acc.length > 0 && !isRouteGroup(previous);

    if (shouldMergeWithPrevious) {
      const lastEntry = acc.pop() || "";
      acc.push(`${lastEntry}/${segment}`);
      return acc;
    }

    acc.push(segment);
    return acc;
  }, []);
}

/**
 * Checks if a route is a dynamic parameter route.
 */
export function isDynamicRoute(path: string): boolean {
  return path.startsWith(":");
}

export function isRouteGroup(segment: string | undefined): segment is string {
  return !!segment && segment.startsWith(GROUP_PREFIX);
}

export function stripRouteGroup(segment: string): string {
  return segment.replace(GROUP_PREFIX, "");
}
