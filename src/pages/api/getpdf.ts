// api/savepdf.js

import { randomUUID } from "crypto";

const PDFDocument = require("pdfkit");
const fs = require("fs");

export default async function handler(req, res) {
  //Send the data for the pdf in the request as query params such as the title and filename
  const tempName = randomUUID();

  const doc = new PDFDocument();
  //use the tmp serverless function folder to create the write stream for the pdf
  let writeStream = fs.createWriteStream(`/tmp/${tempName}.pdf`);
  doc.pipe(writeStream);
  doc.text(JSON.parse(req.body).generatedBios);
  doc.end();

  writeStream.on("finish", function () {
    //once the doc stream is completed, read the file from the tmp folder
    const fileContent = fs.readFileSync(`/tmp/${tempName}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(fileContent);
  });
}
