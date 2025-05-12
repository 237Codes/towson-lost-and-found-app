/**
 * useMediaQuery Hook
 * ------------------
 * Custom hook for matching CSS media queries.
 * - Accepts a media query string (e.g., "(min-width: 768px)").
 * - Returns a boolean indicating if the query currently matches.
 * - Subscribes to media query changes and updates reactively.
 */

import * as React from "react";

// https://github.com/shadcn-ui/ui/blob/main/apps/www/hooks/use-media-query.tsx
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
