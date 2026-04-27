export const ALLOWED_COUNTRIES = ['US', 'GB', 'CA', 'DE', 'FR', 'BR', 'SA'] as const;
export type AllowedCountry = (typeof ALLOWED_COUNTRIES)[number];
