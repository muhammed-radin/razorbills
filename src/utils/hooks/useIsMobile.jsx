import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {
  // Initialize with false or a safe fallback for SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Define the media query check
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // Set the initial value on client mount
    setIsMobile(mediaQuery.matches);

    // Create an event listener to capture window changes
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Listen for resize events matching the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Clean up the listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [breakpoint]);

  return isMobile;
}
