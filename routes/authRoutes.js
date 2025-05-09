import {register,login,logout} from '../controllers/authControllers.js'
import express from 'express'
import {checkCookie} from '../middleware/authCookie.js'
const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/check', checkCookie, (req, res) => {
    const { id, name } = req.user;
  
    res.status(200).json({
      isLoggedIn: true,
      user: {
    id
      },
    });
  });
export default router


