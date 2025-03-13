import { Router } from "express"
import { deleteAutomailRecipients, getAutomailRecipients, manualBatch, postAutomailRecipients, putAutomailRecipients } from "../controller/automailRecipientsController"
import { verifyAccessToken } from '../middleware/index';

const router = Router()

router.use(verifyAccessToken)

router.get("/automail/users", getAutomailRecipients)
router.post("/automail/users", postAutomailRecipients)
router.put("/automail/users", putAutomailRecipients)
router.delete("/automail/users", deleteAutomailRecipients)

router.post("/manual/run", manualBatch)

export default router;