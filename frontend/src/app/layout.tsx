import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider }        from "@/components/ThemeProvider";
import { ContactModalProvider } from "@/components/ContactModal";

export const metadata: Metadata = {
  title: {
    default:  "bathaee — freelance developer team",
    template: "%s · bathaee",
  },
  description:
    "A small multidisciplinary team of senior developers available for freelance " +
    "projects and collaborations. Based in Berlin. bathaee.de",
  metadataBase: new URL("https://bathaee.de"),
  openGraph: {
    title:       "bathaee — freelance developer team",
    description: "Senior developers available for freelance projects and collaborations. Based in Berlin.",
    url:         "https://bathaee.de",
    siteName:    "bathaee",
    type:        "website",
    locale:      "en_US",
  },
  icons: {
    icon:    [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  robots: { index: true, follow: true },
};

// Inline script that runs before first paint — prevents flash of wrong theme.
// Reads localStorage, then falls back to system preference, then to dark.
const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark',  isDark);
    document.documentElement.classList.toggle('light', !isDark);
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`.trim();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning: the inline script mutates class before React
          hydrates, which would otherwise cause a mismatch warning. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ContactModalProvider>
            {children}
          </ContactModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
