// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Risco Cognitivo - Mapa Cognitivo";
export const SITE_DESCRIPTION =
  "Gestão e controle de riscos cognitivos: entenda funções executivas, demandas e estratégias para transformar a intenção em ações.";

export const GITHUB_URL =
  "https://github.com/shadcnblocks/mainline-astro-template";

export const SITE_METADATA = {
  title: {
    default: "Risco Cognitivo - Mapa Cognitivo",
    template: "%s | Mainline",
  },
  description:
    "Risco Cognitivo ajuda a transformar intenções em execução, uma função executiva por vez.",
  keywords: [
    "Astro",
    "astro template",
    "astro theme",
    "astro starter",
    "shadcn template",
    "shadcn theme",
    "shadcn starter",
    "tailwind template",
    "tailwind theme",
    "tailwind starter",
    "mdx template",
    "mdx theme",
    "mdx starter",
  ],
  authors: [{ name: "shadcnblocks.com" }],
  creator: "shadcnblocks.com",
  publisher: "shadcnblocks.com",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  openGraph: {
    title: "Risco Cognitivo - Mapa Cognitivo",
    description:
      "Risco Cognitivo ajuda a transformar intenções em execução, uma função executiva por vez.",
    siteName: "Mainline",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Risco Cognitivo - Mapa Cognitivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Risco Cognitivo - Mapa Cognitivo",
    description:
      "Risco Cognitivo ajuda a transformar intenções em execução, uma função executiva por vez.",
    images: ["/og-image.jpg"],
    creator: "@ausrobdev",
  },
};
