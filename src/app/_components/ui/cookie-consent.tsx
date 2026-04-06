import { useRef } from "react";
import AskCookie from "react-cookie-consent";
import { Button } from "antd";
import { ThemeProvider } from "admiral";
import { theme } from "@/app/_components/providers/theme";
import {
  COOKIE_CONSENT_AGREE,
  COOKIE_CONSENT_DECLINE,
  COOKIE_CONSENT_NAME,
  COOKIE_DECLINED_VALUE,
} from "@/commons/constants/cookie-consent";
import type { TCookieConsent } from "@/commons/types/cookie-consent";
import useCookieConsent from "@/app/_hooks/consent/use-cookie-consent";

export default function CookieConsent() {
  const acceptValue = useRef<TCookieConsent>("modify me before user accept");
  const { isConsentViewing } = useCookieConsent();

  if (!isConsentViewing) return null;

  return (
    <ThemeProvider theme={theme}>
      <AskCookie
        disableStyles
        disableButtonStyles
        enableDeclineButton
        ButtonComponent={Button}
        cookieName={COOKIE_CONSENT_NAME}
        buttonText={COOKIE_CONSENT_AGREE}
        cookieValue={acceptValue.current}
        declineCookieValue={COOKIE_DECLINED_VALUE}
        declineButtonText={COOKIE_CONSENT_DECLINE}
        location=""
        style={{
          background: theme.components?.Layout?.headerBg,
          color: theme.components?.Layout?.headerColor,
          border: `1px solid ${theme.token?.colorPrimary}`,
          left: "unset",
          right: "1rem",
          bottom: "1rem",
          width: "max-content",
          position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          gap: "1rem",
          maxWidth: "calc(100vw - 2rem)",
          borderRadius: "0.375rem",
        }}
        customButtonWrapperAttributes={{
          style: {
            flexShrink: "0",
            gap: "0.5rem",
            display: "flex",
          },
        }}
        customButtonProps={{ type: "primary" }}
        customDeclineButtonProps={{ type: "text" }}
      >
        Do you accept cookies?
      </AskCookie>
    </ThemeProvider>
  );
}
