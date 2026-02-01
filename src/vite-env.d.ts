/// <reference types="vite/client" />

declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_SERVICE_SSO_URL?: string;
  readonly VITE_SERVICE_AI_URL?: string;
  readonly VITE_SERVICE_CRM_URL?: string;
  readonly VITE_SERVICE_ERP_URL?: string;
  readonly VITE_SERVICE_FINANCE_URL?: string;
  readonly VITE_SERVICE_PDV_URL?: string;
  readonly VITE_SERVICE_RPG_URL?: string;
  readonly VITE_SERVICE_OMNICHANNEL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
