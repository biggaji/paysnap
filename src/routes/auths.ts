import { Router } from 'express';
import { activateAccountController, signInController, signUpController } from '../controllers/auths';

const router = Router();

router.get('/signup', signUpController);
router.get("/signin", signInController);
router.get("/activate", activateAccountController);


export default router;