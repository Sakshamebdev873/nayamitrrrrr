import express from 'express'
import {analyzePdf, changeSession, createChat, deleteCaseHistory, deleteSession, generateDocument, getHistory, getNearbyJudiciaryOSM, getUserCaseHistory, newSessionId, submitSurvey, submitUserCaseForm, suggestAlternativeResolution, surveyQuestion} from '../controllers/chatControllers.js'
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
router.post('/delete/:id',deleteSession)
router.get('/new/:id',newSessionId)
router.post('/caseHelper',submitUserCaseForm)
router.get('/caseHistory/:id',getUserCaseHistory)
router.delete('/deleteHistory/:userId/:caseId',deleteCaseHistory)
export default router