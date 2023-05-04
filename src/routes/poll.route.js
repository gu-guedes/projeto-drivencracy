import { Router } from "express"
import { createPoll, getPoll } from "../controllers/poll.controllers.js"
import validateSchema from "../middlewares/validateSchema.middleware.js"
import { pollSchema } from "../schemas/poll.schema.js"

const pollRouter = Router()

pollRouter.post("/poll", validateSchema(pollSchema), createPoll)
pollRouter.get("/poll", getPoll)

export default pollRouter