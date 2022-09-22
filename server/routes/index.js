import { Router } from 'express'
import radioRouter from './radio.js'

const router = Router()

router.use('/radio', radioRouter)

export default router