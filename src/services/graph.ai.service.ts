import { StateGraph, START, END } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

type JUDGEMENT = {
  winner: "solution_1" | "solution_2";
  solution_1_score: number;
  solution_2_score: number;
};

type AIBATTLEARENASTATE = {
  messages: BaseMessage[];
  solution_1: string;
  solution_2: string;
  judgement: JUDGEMENT;
};

const state: AIBATTLEARENASTATE = {
  messages: [],
  solution_1: "",
  solution_2: "",
  judgement: {
    winner: "solution_1",
    solution_1_score: 0,
    solution_2_score: 0,
  },
};
