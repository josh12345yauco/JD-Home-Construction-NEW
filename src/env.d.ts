/// <reference types="astro/client" />

declare const Astro: Readonly<import("astro").AstroGlobal>;

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly BASE_NAME: string;
  }
}
