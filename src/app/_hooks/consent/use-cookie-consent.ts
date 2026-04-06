import { getCookieConsentValue as getCCV } from "react-cookie-consent";
import { COOKIE_CONSENT_NAME, COOKIE_DECLINED_VALUE } from "@/commons/constants/cookie-consent";
import { env } from "@/libs/env";
import { TCookieConsent } from "@/commons/types/cookie-consent";

export function getCookieConsentValue(): TCookieConsent {
  return getCCV(COOKIE_CONSENT_NAME);
}

export default function useCookieConsent() {
  const currentValue = getCookieConsentValue();
  const isConsentViewing =
    env.VITE_COOKIE_CONSENT && (currentValue === COOKIE_DECLINED_VALUE || !currentValue);

  return { isConsentViewing, cookieConsentValue: currentValue };
}
