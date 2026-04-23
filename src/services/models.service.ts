import { ChatGoogle } from "@langchain/google";
import config from "../config/config.js";

const model = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: config.GOOGLE_API_KEY,
});
