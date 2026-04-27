import { HumanMessage } from "@langchain/core/messages";
import {
  END,
  MessagesValue,
  ReducedValue,
  START,
  StateGraph,
  StateSchema,
} from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import {
  getMistralModel,
  getCohereModel,
  geminiModel,
} from "./models.service.js";
import { createAgent, providerStrategy } from "langchain";

const State = new StateSchema({
  messages: MessagesValue,
  solution_1: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  solution_2: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  judge_recommendation: new ReducedValue(
    z.object().default({
      solution_1_sccore: 0,
      solution_2_score: 0,
      winner: "solution_1" | "solution_2",
    }),
    {
      reducer: (current, next) => {
        return next;
      },
    },
  ),
});

const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {
  const [mistral_solution, cohere_solution] = await Promise.all([
    getMistralModel().invoke(state.messages[0].text),
    getCohereModel().invoke(state.messages[0].text),
  ]);

  return {
    solution_1: mistral_solution.text,
    solution_2: cohere_solution.text,
  };
};

const judgeNode: GraphNode<typeof State> = async (state: typeof State) => {
  const { solution_1, solution_2 } = state;

  const judge = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(
      z.object({
        solution_1_sccore: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
      }),
    ),
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(
        `You are a judge tasked with evaluating two solutions to the following problem: ${state.messages[0].text}. Here are the solutions: Solution 1: ${solution_1}. Solution 2: ${solution_2}. Please provide a score between 0 and 10 for each solution, where 10 is the best score. Also, indicate which solution is better based on the scores.`,
      ),
    ],
  });

  const result = judgeResponse.structuredResponse;

  return {
    judge_recommendation: result,
  };
};

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();

export default async function (userMessage: string) {
  const result = await graph.invoke({
    messages: [new HumanMessage(userMessage)],
  });

  console.log(result);
  return result.messages;
}
