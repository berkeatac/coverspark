import type { NextApiRequest, NextApiResponse } from "next";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { name, companyName, description } = JSON.parse(_req.body);
  openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `I'm ${name}. I'm applying for a job at ${companyName} with a description of ${description}. Write a cover letter for me to apply at this job.`,
        },
      ],
      //   prompt: `I'm ${_req.body.name}. I'm applying for a job at ${_req.body.companyName} with a description of ${_req.body.description}. Write me a cover letter.`,
    })
    .then((data) => {
      res.status(200).json({ response: data.data.choices[0].message.content });
    });
}
