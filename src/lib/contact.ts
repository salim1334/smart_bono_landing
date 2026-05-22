export const TELEGRAM_USERNAME = "Alarmtechsolution";

const message = encodeURIComponent("የአላርም ቴክኖሎጂን ስማርት ቦኖ መጠቀም ፈልጌ ነበር");

export const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}?text=${message}`;

export function openTelegramChat(): void {
  window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
}
