const LetterPreview = ({ generatedBios, fileName }) => {
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
    fileLink.download = fileName;

    // triggers the click event
    fileLink.click();
  };

  return (
    <>
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
    </>
  );
};
export default LetterPreview;
