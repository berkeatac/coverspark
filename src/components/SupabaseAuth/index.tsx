import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const SupabaseAuth = () => {
  const supabase = useSupabaseClient();

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google"]}
      redirectTo={
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://coverspark.vercel.app"
      }
      onlyThirdPartyProviders
    />
  );
};

export default SupabaseAuth;
