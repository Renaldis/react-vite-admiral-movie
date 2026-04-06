import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/libs/supabase/client";

type Session = {
  signin: () => void;
  signout: () => void;
  session?: {
    access_token?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any;
  };
  status?: "authenticated" | "authenticating" | "unauthenticated";
};

const SessionContext = createContext<Session>({
  signin: () => {},
  signout: () => {},
});

const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<Session["session"]>();
  const [status, setStatus] = useState<Session["status"]>("authenticating");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setSessionData({
          access_token: data.session.access_token,
          user: data.session.user,
        });
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    };

    init();

    // 🔥 AUTO SYNC (ini penting banget)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSessionData({
          access_token: session.access_token,
          user: session.user,
        });
        setStatus("authenticated");
      } else {
        setSessionData(undefined);
        setStatus("unauthenticated");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signin = () => {
    setStatus("authenticating");
  };

  const signout = async () => {
    await supabase.auth.signOut();
    setSessionData(undefined);
    setStatus("unauthenticated");
    navigate("/auth/login");
  };

  return (
    <SessionContext.Provider
      value={{
        session: sessionData,
        status,
        signin,
        signout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;
