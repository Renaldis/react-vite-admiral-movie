import { ROUTES } from "./commons/constants/routes";
import { registerMiddleware } from "./libs/react-router";
import { supabase } from "./libs/supabase/client";

const mappingPublicRoutes = [ROUTES.auth.login, ROUTES.auth.callback, ROUTES.auth.register];

registerMiddleware({
  matcher: "^/$",
  handler: async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      return { redirect: ROUTES.dashboard };
    }

    return { redirect: ROUTES.auth.login };
  },
});

registerMiddleware({
  matcher: ".*",
  handler: async (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const { data } = await supabase.auth.getSession();
    const session = data.session;

    const isPublicRoute = mappingPublicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    // belum login → redirect ke login
    if (!isPublicRoute && !session) {
      const redirectTo = `${ROUTES.auth.login}?redirect=${encodeURIComponent(pathname)}`;
      return { redirect: redirectTo };
    }

    // sudah login tapi ke login page → redirect ke dashboard
    if (isPublicRoute && session) {
      return { redirect: ROUTES.dashboard };
    }

    return;
  },
});
