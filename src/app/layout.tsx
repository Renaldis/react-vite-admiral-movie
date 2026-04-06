import SessionProvider from "./_components/providers/session";
import AntDProvider from "./_components/providers/theme";
import CookieConsent from "./_components/ui/cookie-consent";
import ReactGrab from "./_components/ui/react-grab";

function MainLayout() {
  return (
    <SessionProvider>
      <AntDProvider />
      <CookieConsent />
      {import.meta.env.DEV && <ReactGrab />}
    </SessionProvider>
  );
}
export default MainLayout;
