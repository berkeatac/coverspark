import Head from "next/head";
import { useState } from "react";
import styles from "../../../styles/Home.module.css";
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
        prompt: `My name is ${inputState.name} and I am applying for a job at ${inputState.companyName}. The job ad has a description of: ${inputState.description}. Please write a cover letter for me, of maximum 1500 characters. Do not mention specfic technologies I haven't mentioned in my skills.`,
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
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.container}>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={(e) => {
              generateBio(e);
            }}
          >
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              required
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
              onChange={(e) =>
                setInputState({ ...inputState, description: e.target.value })
              }
            />
            <button role="submit">Submit</button>
          </form>

          <p style={{ whiteSpace: "pre-line" }}>{data?.response}</p>

          <div>
            <p style={{ whiteSpace: "pre-line" }}>{generatedBios}</p>
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
