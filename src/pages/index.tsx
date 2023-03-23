import { useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import LetterPreview from "../components/LetterPreview";
import InputPanel from "../components/InputPanel";
import SupabaseAuth from "../components/SupabaseAuth";

export default function Home() {
  const [inputState, setInputState] = useState({
    name: "",
    companyName: "",
    description: "",
    skills: "",
  });
  const [generatedBios, setGeneratedBios] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useUser();
  const supabase = useSupabaseClient();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <SupabaseAuth />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <main className="h-full">
        <button onClick={() => supabase.auth.signOut()}>log out</button>
        <div className="container mx-auto px-12 flex flex-col sm:flex-row gap-8 py-16 min-w-full h-full">
          <InputPanel
            inputState={inputState}
            setInputState={setInputState}
            loading={loading}
            setGeneratedBios={setGeneratedBios}
            setLoading={setLoading}
          />

          <div className="basis-3/4 h-full relative">
            <LetterPreview
              generatedBios={generatedBios}
              fileName={`${inputState.name.replaceAll(" ", "")}-${
                inputState.companyName
              }-cover-letter.pdf`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
