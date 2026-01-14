// Rjupa theme colors and fonts
export const theme = {
  colors: {
    sand: "#E3DCCC",
    text: "#111111",
    bg: "#FFFFFF",
    cardBorder: "#E6E1D6",
    icon: "#111111",
    muted: "#555555",
  },
  fonts: {
    // Primary (when we have Tenon-files i assets/fonts)
    heading: "Tenon-Medium",
    body: "Tenon-Light",

    // Fallback (When Tenon is not available)
    headingFallback: "System",
    bodyFallback: "System",
  },
} as const;
