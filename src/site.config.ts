/** Single source of truth for identity + contact. Edit here, it updates everywhere. */
export interface ContactItem {
  id: string;
  label: string;
  value: string;
  /** "copy": no URL, the UI shows a copy button. "link": opens href. */
  type: "copy" | "link";
  href?: string;
}

export const site = {
  name: "KAYDEN",
  handle: "kayd0en",
  role: "Developer in Roblox Studio",
  description: "Portfolio of KAYDEN — 3D art, animation, drawing, Coding and more.",
  contact: [{ id: "discord", label: "Discord", value: "kayd0en", type: "copy" }] satisfies ContactItem[] as ContactItem[],
};
