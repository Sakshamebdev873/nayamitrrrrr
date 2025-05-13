import express from 'express'
import {analyzePdf, changeSession, createChat, deleteSession, generateDocument, getHistory, getNearbyJudiciaryOSM, newSessionId, submitSurvey, submitUserCaseForm, suggestAlternativeResolution, surveyQuestion} from '../controllers/chatControllers.js'
const router = express.Router()
import upload from '../middleware/multerMiddleware.js' 
router.post('/create/:id',createChat)
router.get('/history/:id',getHistory)
router.post('/docs',generateDocument)
router.post('/court',getNearbyJudiciaryOSM)
router.get('/surveyQuestion',surveyQuestion)
router.post('/submitSurvey',submitSurvey)
router.post('/dispute',suggestAlternativeResolution)
router.post("/analyze", upload.single("pdf"), analyzePdf);
router.post('/change',changeSession)
router.delete('/delete/:id',deleteSession)
router.get('/new/:id',newSessionId)
router.post('/caseHelper',submitUserCaseForm)
export default router