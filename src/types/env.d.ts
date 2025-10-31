/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_URL: string;
  // add more vars here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
