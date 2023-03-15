// import type { NextApiRequest, NextApiResponse } from "next";
// const { Configuration, OpenAIApi } = require("openai");

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export default async function handler(
//   _req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { name, companyName, description } = JSON.parse(_req.body);
//   openai
//     .createCompletion({
//       //   model: "gpt-3.5-turbo",
//       //   messages: [
//       //     {
//       //       role: "user",
//       //       content: `I'm ${name}. I'm applying for a job at ${companyName} with a description of ${description}. Write a cover letter for me to apply at this job.`,
//       //     },
//       //   ],
//       model: "text-davinci-003",
//       max_tokens: 500,
//       prompt: `I'm ${name}. I'm applying for a job at ${companyName} with a description of ${description}. Write me a cover letter.`,
//     })
//     .then((data) => {
//       console.log(data);
//       //   res.status(200).json({ response: data.data.choices[0].message.content });
//       res.status(200).json({ response: data.data.choices[0].text });
//     });
// }

import { OpenAIStream } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { inputState } = (await req.json()) as {
    inputState?: any;
  };

  const payload = {
    model: "text-davinci-003",
    prompt: `My name is ${inputState.name} and I am applying for a job at ${
      inputState.companyName
    }. ${
      inputState.description
        ? "The job ad has a description of: " + inputState.description
        : ""
    }. ${
      inputState.skills
        ? "I have the following skills: " + inputState.skills
        : ""
    }. Please write a cover letter for me, of maximum 1500 characters. Only mention the skills I have provided if any.`,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 400,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
