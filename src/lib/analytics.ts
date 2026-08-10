const GA_SCRIPT_ID = "google-analytics-script";
const GA_INIT_ID = "google-analytics-init";

function normalizeMeasurementId(value: string | undefined): string | null {
  const measurementId = value?.trim();
  return measurementId ? measurementId : null;
}

export function installGoogleAnalytics(measurementIdValue: string | undefined) {
  const measurementId = normalizeMeasurementId(measurementIdValue);

  if (!measurementId) {
    return;
  }

  if (document.getElementById(GA_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    measurementId,
  )}`;
  document.head.appendChild(script);

  const initScript = document.createElement("script");
  initScript.id = GA_INIT_ID;
  // 環境変数が設定されたビルドだけでGAを初期化し、未設定時は外部通信を発生させない。
  initScript.text = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)});
`;
  document.head.appendChild(initScript);
}
