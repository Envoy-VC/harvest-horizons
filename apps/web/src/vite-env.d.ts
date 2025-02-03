/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
