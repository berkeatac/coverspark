import type { NextApiRequest, NextApiResponse } from "next";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { name, companyName, description } = JSON.parse(_req.body);
  openai
    .createCompletion({
      //   model: "gpt-3.5-turbo",
      //   messages: [
      //     {
      //       role: "user",
      //       content: `I'm ${name}. I'm applying for a job at ${companyName} with a description of ${description}. Write a cover letter for me to apply at this job.`,
      //     },
      //   ],
      model: "text-davinci-003",
      max_tokens: 500,
      prompt: `I'm ${name}. I'm applying for a job at ${companyName} with a description of ${description}. Write me a cover letter.`,
    })
    .then((data) => {
      console.log(data);
      //   res.status(200).json({ response: data.data.choices[0].message.content });
      res.status(200).json({ response: data.data.choices[0].text });
    });
}
