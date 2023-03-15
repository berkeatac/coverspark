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
  const { mutate, data } = useMutation(postLetterRequest, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={(e) => {
            e.preventDefault();
            console.log(inputState);
            mutate(inputState);
          }}
        >
          <label for="name">Name *</label>
          <input
            id="name"
            type="text"
            required
            value={inputState.name}
            onChange={(e) =>
              setInputState({ ...inputState, name: e.target.value })
            }
          />
          <label for="company-name">Company Name *</label>
          <input
            id="company-name"
            type="text"
            required
            value={inputState.companyName}
            onChange={(e) =>
              setInputState({ ...inputState, companyName: e.target.value })
            }
          />
          <label for="description">Job Description</label>
          <textarea
            id="description"
            type="text"
            maxLength={1000}
            value={inputState.description}
            onChange={(e) =>
              setInputState({ ...inputState, description: e.target.value })
            }
          />
          <button role="submit">Submit</button>
        </form>

        <p style={{ whiteSpace: "pre-line" }}>{data?.response}</p>
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
