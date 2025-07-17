export interface ActionResponse {
  status: 'success' | 'error';
  error: string | null;
  data?: unknown;
}
