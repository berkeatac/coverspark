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
    }. Please write a cover letter for me, of maximum 1500 characters. Only mention the skills I have provided. Do not mention skills I haven't told you directly. Do not give information with quantitative value like years of experience as you don't know for certain.`,
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
