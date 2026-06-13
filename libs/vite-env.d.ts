interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __PARTNER_CONFIG__?: {
    partner?: string;
    partnerId?: string;
    partnerName?: string;
    apiUrl?: string;
  };
}
