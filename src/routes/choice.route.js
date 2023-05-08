import { Router } from "express";
import { addChoice, addVote, getIdChoice, resultPoll } from "../controllers/choice.controllers.js";

const choiceRouter = Router()

choiceRouter.post("/choice", addChoice)
choiceRouter.get("/poll/:id/choice", getIdChoice)
choiceRouter.post("/choice/:id/vote", addVote)
choiceRouter.get("/poll/:id/result", resultPoll)
export default choiceRouter
