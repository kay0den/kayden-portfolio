/** Single source of truth for identity + contact. Edit here, it updates everywhere. */
export const site = {
  name: "KAYDEN",
  handle: "kayd0en",
  role: "Creative Developer & Artist",
  description: "Portfolio of KAYDEN — 3D art, animation, drawing, programming and more.",
  contact: [
    // type "copy" = no URL, the UI shows a copy-to-clipboard button
    { id: "discord", label: "Discord", value: "kayd0en", type: "copy" as const },
    // Add more platforms with the same handle, e.g.:
    // { id: "github", label: "GitHub", value: "kayd0en", href: "https://github.com/kayd0en", type: "link" as const },
  ],
} as const;
