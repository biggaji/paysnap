import { Router } from 'express';
import { activateAccountController, CreateAccountPostController, LoginPostController, RedenderDashboardController, signInController, signUpController } from '../controllers/auths';

const router = Router();

router.get('/signup', signUpController);
router.get("/signin", signInController);
router.get("/activate", activateAccountController);
router.get("/dashboard", RedenderDashboardController);


router.post('/signup', CreateAccountPostController);
router.post("/signin", LoginPostController);

export default router;