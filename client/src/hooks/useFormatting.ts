/**
 * Formatting utilities for Brazilian Portuguese
 */

const ptBRLocale = "pt-BR";

export function useFormatting() {
  /**
   * Format date in Brazilian Portuguese
   */
  const formatDate = (date: Date | string | number): string => {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    return d.toLocaleDateString(ptBRLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /**
   * Format date and time in Brazilian Portuguese
   */
  const formatDateTime = (date: Date | string | number): string => {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    return d.toLocaleDateString(ptBRLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  /**
   * Format time only in Brazilian Portuguese
   */
  const formatTime = (date: Date | string | number): string => {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    return d.toLocaleTimeString(ptBRLocale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  /**
   * Format currency in Brazilian Real
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(ptBRLocale, {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  /**
   * Format number with thousand separators
   */
  const formatNumber = (value: number, decimals: number = 0): string => {
    return new Intl.NumberFormat(ptBRLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  /**
   * Format relative time (e.g., "há 2 horas")
   */
  const formatRelativeTime = (date: Date | string | number): string => {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "agora";
    if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;

    return formatDate(d);
  };

  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatCurrency,
    formatNumber,
    formatRelativeTime,
  };
}
