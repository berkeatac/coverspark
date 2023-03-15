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
        prompt: `My name is ${inputState.name} and I am applying for a job at ${inputState.companyName}. The job ad has a description of: ${inputState.description}. Please write a cover letter for me, of maximum 1500 characters.`,
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
        <div className="container mx-auto px-4 flex flex-row gap-4 py-16 min-w-full h-full">
          <form
            className="flex flex-col basis-1/4"
            onSubmit={(e) => {
              generateBio(e);
              // e.preventDefault();
              // console.log(inputState);
              // mutate(inputState);
            }}
          >
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              required
              className="input input-bordered w-full max-w-xs mb-4"
              value={inputState.name}
              onChange={(e) =>
                setInputState({ ...inputState, name: e.target.value })
              }
            />
            <label htmlFor="company-name">Company Name *</label>
            <input
              id="company-name"
              type="text"
              required
              className="input input-bordered w-full max-w-xs mb-4"
              value={inputState.companyName}
              onChange={(e) =>
                setInputState({ ...inputState, companyName: e.target.value })
              }
            />
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              maxLength={1000}
              value={inputState.description}
              className="textarea textarea-bordered mb-4"
              onChange={(e) =>
                setInputState({ ...inputState, description: e.target.value })
              }
            />
            <button role="submit" className="btn">
              Submit
            </button>
          </form>
          {/* 
          <p style={{ whiteSpace: "pre-line" }}>{data?.response}</p> */}

          <div className="basis-3/4 h-full">
            <textarea
              className="h-full min-w-full textare-bordered resize-none whitespace-pre-line p-4"
              value={generatedBios}
            ></textarea>
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