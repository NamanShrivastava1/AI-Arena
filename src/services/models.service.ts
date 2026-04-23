import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";

export const model = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: config.GOOGLE_API_KEY,
});

export const getMistralModel = (): any => {
  return new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY,
  });
};

export const getCohereModel = (): any => {
  return new ChatCohere({
    model: "command-r-08-2024",
    apiKey: config.COHERE_API_KEY,
  });
};
