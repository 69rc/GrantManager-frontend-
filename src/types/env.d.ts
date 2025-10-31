declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // Add other environment variables as needed
  }
}

export {};