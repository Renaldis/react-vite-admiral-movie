/// <reference types="vite/client" />

// Define the interface for the environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __REACT_GRAB__?: {
    activate: () => void;
    deactivate: () => void;
  };
}
