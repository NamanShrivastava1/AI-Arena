import express from "express";
import runGraph from "./services/graph.ai.service.js";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const result = await runGraph("Write an code for Factorial function in js");

  res.json(result);
});

export default app;
