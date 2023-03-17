import Head from "next/head";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const [inputState, setInputState] = useState({
    name: "",
    companyName: "",
    description: "",
    skills: "",
  });
  const [generatedBios, setGeneratedBios] = useState("");
  const [loading, setLoading] = useState(false);

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

  const { data, status } = useSession();

  return (
    <div className="h-screen">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full">
        <div className="flex items-center gap-2">
          {status === "loading" && (
            <div className="w-8 h-8 rounded-full bg-purple-50 border-2" />
          )}

          {status === "unauthenticated" && (
            <>
              <button
                onClick={() =>
                  signIn(undefined, {
                    callbackUrl:
                      "https://ruyugxhdgjlugjtcewte.supabase.co/auth/v1/callback",
                  })
                }
              >
                Sign In
              </button>
              <div className="w-8 h-8 rounded-full border-2" />
            </>
          )}

          {status === "authenticated" && (
            <>
              <p className="text-sm font-medium">Welcome, {data?.user.name}</p>
              <img
                onClick={() => signOut()}
                className="w-8 h-8 rounded-full border-2"
                src={data?.user.image}
                alt=""
              />
            </>
          )}
        </div>
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
