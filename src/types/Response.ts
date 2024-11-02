export default interface Response {
  success: boolean;
  message?: string;
  payload?: unknown;
  data?: Record<string, unknown>;
}
