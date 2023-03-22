const InputPanel = ({
  inputState,
  setInputState,
  loading,
  setGeneratedBios,
  setLoading,
}) => {
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
        onChange={(e) => setInputState({ ...inputState, name: e.target.value })}
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
  );
};

export default InputPanel;
