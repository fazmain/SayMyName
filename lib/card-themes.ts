export interface CardTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  buttonStyle: string;
  isPremium?: boolean;
}

export const CARD_THEMES: CardTheme[] = [
  {
    id: "default",
    name: "Classic",
    description: "Clean and professional",
    preview: "bg-white",
    gradient: "bg-white",
    textColor: "text-gray-900",
    accentColor: "text-blue-600",
    buttonStyle: "bg-slate-700 hover:bg-slate-600",
  },

  {
    id: "pacific-dream",
    name: "Pacific Dream",
    description: "Cool and refreshing ocean vibes.",
    preview: "bg-gradient-to-br from-cyan-100 to-blue-200 border-cyan-200",
    gradient: "bg-gradient-to-br from-cyan-100 to-blue-200",
    textColor: "text-cyan-900",
    accentColor: "text-blue-700",
    buttonStyle:
      "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Warm and radiant, like a perfect sunset.",
    preview:
      "bg-gradient-to-br from-yellow-100 via-orange-200 to-red-200 border-yellow-200",
    gradient: "bg-gradient-to-br from-yellow-100 via-orange-200 to-red-200",
    textColor: "text-orange-900",
    accentColor: "text-red-600",
    buttonStyle:
      "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
  },
  {
    id: "emerald-isle",
    name: "Emerald Isle",
    description: "Lush and vibrant greens of nature.",
    preview: "bg-gradient-to-br from-green-100 to-teal-200 border-green-200",
    gradient: "bg-gradient-to-br from-green-100 to-teal-200",
    textColor: "text-green-900",
    accentColor: "text-teal-700",
    buttonStyle:
      "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600",
  },
  {
    id: "amethyst",
    name: "Amethyst",
    description: "Mystical and calming shades of purple.",
    preview:
      "bg-gradient-to-br from-purple-200 to-indigo-200 border-purple-200",
    gradient: "bg-gradient-to-br from-purple-200 to-indigo-200",
    textColor: "text-purple-900",
    accentColor: "text-indigo-700",
    buttonStyle:
      "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600",
  },
  {
    id: "cosmic-dust",
    name: "Cosmic Dust",
    description: "A deep and mysterious journey through space.",
    preview:
      "bg-gradient-to-br from-gray-900 via-purple-900 to-black border-gray-700",
    gradient: "bg-gradient-to-br from-gray-900 via-purple-900 to-black",
    textColor: "text-gray-200",
    accentColor: "text-purple-400",
    buttonStyle:
      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    description: "Delicate and sweet, inspired by spring.",
    preview: "bg-gradient-to-br from-pink-100 to-rose-200 border-pink-200",
    gradient: "bg-gradient-to-br from-pink-100 to-rose-200",
    textColor: "text-rose-900",
    accentColor: "text-pink-700",
    buttonStyle:
      "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
  },
  {
    id: "solar-flare",
    name: "Solar Flare",
    description: "Bold, energetic, and impossible to ignore.",
    preview:
      "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 border-yellow-500",
    gradient: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
    textColor: "text-white",
    accentColor: "text-yellow-200",
    buttonStyle:
      "bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500",
  },
  {
    id: "mojave-dusk",
    name: "Mojave Dusk",
    description: "Warm desert sands meeting a cool evening sky.",
    preview:
      "bg-gradient-to-br from-orange-200 via-rose-300 to-indigo-300 border-orange-200",
    gradient: "bg-gradient-to-br from-orange-200 via-rose-300 to-indigo-300",
    textColor: "text-indigo-900",
    accentColor: "text-rose-700",
    buttonStyle:
      "bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700",
  },
  {
    id: "mint-condition",
    name: "Mint Condition",
    description: "Crisp, clean, and refreshingly modern.",
    preview:
      "bg-gradient-to-br from-white via-emerald-50 to-teal-100 border-emerald-200",
    gradient: "bg-gradient-to-br from-white via-emerald-50 to-teal-100",
    textColor: "text-teal-900",
    accentColor: "text-emerald-600",
    buttonStyle:
      "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description: "Sleek, powerful, and forged in darkness.",
    preview:
      "bg-gradient-to-br from-slate-800 via-gray-900 to-black border-slate-700",
    gradient: "bg-gradient-to-br from-slate-800 via-gray-900 to-black",
    textColor: "text-gray-300",
    accentColor: "text-cyan-400",
    buttonStyle: "bg-slate-700 hover:bg-slate-600",
  },
  {
    id: "raspberry-sorbet",
    name: "Raspberry Sorbet",
    description: "A sweet and tangy burst of color.",
    preview: "bg-gradient-to-br from-rose-200 to-fuchsia-300 border-rose-200",
    gradient: "bg-gradient-to-br from-rose-200 to-fuchsia-300",
    textColor: "text-fuchsia-900",
    accentColor: "text-rose-600",
    buttonStyle:
      "bg-gradient-to-r from-rose-500 to-fuchsia-500 hover:from-rose-600 hover:to-fuchsia-600",
  },
  {
    id: "alpine-glow",
    name: "Alpine Glow",
    description: "The first light of dawn on a mountain peak.",
    preview: "bg-gradient-to-br from-slate-50 to-cyan-100 border-slate-200",
    gradient: "bg-gradient-to-br from-slate-50 to-cyan-100",
    textColor: "text-slate-800",
    accentColor: "text-cyan-700",
    buttonStyle:
      "bg-gradient-to-r from-slate-600 to-cyan-700 hover:from-slate-700 hover:to-cyan-800",
  },
  {
    id: "neptune",
    name: "Neptune",
    description: "A mysterious journey into the deep blue.",
    preview:
      "bg-gradient-to-tr from-blue-900 via-indigo-900 to-gray-900 border-blue-800",
    gradient: "bg-gradient-to-tr from-blue-900 via-indigo-900 to-gray-900",
    textColor: "text-blue-200",
    accentColor: "text-cyan-300",
    buttonStyle:
      "bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800",
  },
];

export const getThemeById = (id: string): CardTheme => {
  return CARD_THEMES.find((theme) => theme.id === id) || CARD_THEMES[0];
};
