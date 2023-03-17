import Head from "next/head";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Home() {
  const [inputState, setInputState] = useState({
    name: "",
    companyName: "",
    description: "",
    skills: "",
  });
  const [generatedBios, setGeneratedBios] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);

  const getPdf = async () => {
    const response = await fetch("/api/getpdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/pdf",
      },
      body: JSON.stringify({
        generatedBios,
      }),
    });

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    // create <a> tag dinamically
    var fileLink = document.createElement("a");
    fileLink.href = fileURL;

    // it forces the name of the downloaded file
    fileLink.download = `${inputState.name.replaceAll(" ", "")}-${
      inputState.companyName
    }-cover-letter.pdf`;

    // triggers the click event
    fileLink.click();
  };

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputState,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  console.log();
  // const { data, status } = useSession();
  const user = useUser();
  const supabase = useSupabaseClient();
  console.log(user);

  let data = user?.id
    ? supabase
        .from("credits")
        .select("*")
        .eq("id", user?.id)
        .single()
        .then((data) => setCredits(data?.data?.credits))
    : null;

  useEffect(() => {
    if (supabase && user) {
      supabase
        .rpc("increment", { row_id: user.id })
        .then(({ data, error }) => console.log(data, error));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          redirectTo={
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "https://coverspark.vercel.app"
          }
        />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full">
        <p>Credits: {credits}</p>
        <button onClick={() => supabase.auth.signOut()}>log out</button>
        <div className="container mx-auto px-12 flex flex-col sm:flex-row gap-8 py-16 min-w-full h-full">
          <form
            className="flex flex-col basis-1/4"
            onSubmit={(e) => {
              generateBio(e);
            }}
          >
            <label htmlFor="name" className="label">
              <span className="label-text">Name</span>
              <span className="label-text-alt">*required</span>
            </label>
            <input
              id="name"
              disabled={loading}
              type="text"
              required
              className="input input-bordered input-sm min-w-full max-w-xs mb-8 py-1 h-12 px-4"
              value={inputState.name}
              onChange={(e) =>
                setInputState({ ...inputState, name: e.target.value })
              }
            />
            <label htmlFor="company-name" className="label">
              <span className="label-text">Company Name</span>
              <span className="label-text-alt">*required</span>
            </label>
            <input
              id="company-name"
              disabled={loading}
              type="text"
              required
              className="input input-bordered input-sm min-w-full max-w-xs mb-8 py-1 h-12 px-4"
              value={inputState.companyName}
              onChange={(e) =>
                setInputState({ ...inputState, companyName: e.target.value })
              }
            />
            <label htmlFor="skills" className="label">
              <span className="label-text">Your skills</span>
            </label>
            <input
              id="skills"
              disabled={loading}
              type="text"
              className="input input-bordered input-sm min-w-full max-w-xs mb-8 py-1 h-12 px-4"
              placeholder="Enter keywords for skills here"
              value={inputState.skills}
              onChange={(e) =>
                setInputState({ ...inputState, skills: e.target.value })
              }
            />
            <label htmlFor="description" className="label">
              <span className="label-text">Job Description</span>
            </label>
            <textarea
              id="description"
              disabled={loading}
              maxLength={1000}
              value={inputState.description}
              className="textarea textarea-bordered mb-8 h-48"
              placeholder="Copy the job description here"
              onChange={(e) =>
                setInputState({ ...inputState, description: e.target.value })
              }
            />
            <button role="submit" className="btn" disabled={loading}>
              Submit
            </button>
          </form>

          <div className="basis-3/4 h-full relative">
            <p className="h-full min-w-full textare-bordered border resize-none whitespace-pre-line p-4 focus:border-none focus:outline-slate-500">
              {generatedBios ? (
                generatedBios
              ) : (
                <span className="text-slate-500">
                  Your cover letter will appear here..
                </span>
              )}
            </p>

            {generatedBios && (
              <div className="absolute top-4 right-4 w-34 z-50 flex flex-row gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedBios);
                  }}
                >
                  Copy
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    getPdf();
                  }}
                >
                  Download as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
