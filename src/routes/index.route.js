import choiceRouter from "./choice.route.js"
import pollRouter from "./poll.route.js"
import { Router } from "express"

const router = Router()
router.use(pollRouter)
router.use(choiceRouter)

export default router