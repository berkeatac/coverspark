import Head from "next/head";
import { useState } from "react";
import styles from "../../styles/Home.module.css";
import { useMutation } from "@tanstack/react-query";

const postLetterRequest = (body) =>
  fetch("/api/gpt", { body: JSON.stringify(body), method: "POST" }).then(
    (res) => res.json()
  );

export default function Home() {
  const [inputState, setInputState] = useState({
    name: "",
    companyName: "",
    description: "",
    skills: "",
  });
  const [generatedBios, setGeneratedBios] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutate, data } = useMutation(postLetterRequest, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

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

  return (
    <div className="h-screen">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full">
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
              <button
                className="btn btn-outline btn-sm absolute top-4 right-4 w-16 z-50"
                onClick={() => {
                  navigator.clipboard.writeText(generatedBios);
                }}
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </main>

      {/* <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer> */}
    </div>
  );
}
