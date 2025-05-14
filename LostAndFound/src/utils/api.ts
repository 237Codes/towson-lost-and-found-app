export const getApiUrl = (path: string) => {
  const baseUrl =
    (import.meta.env as any).PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
};
