import { Router } from 'express';
import { activateAccountController, ActivateAccountPostController, CreateAccountPostController, LoginPostController, logout, RedenderDashboardController, signInController, signUpController } from '../controllers/auths';
import decodeUser from '../../@utils/decodeUserMiddleware';

const router = Router();

router.get('/signup', signUpController);
router.get("/signin", signInController);
router.get("/activate", decodeUser, activateAccountController);
router.get("/dashboard", decodeUser, RedenderDashboardController);
router.get("/exit", decodeUser, logout);



router.post('/signup', CreateAccountPostController);
router.post("/signin", LoginPostController);
router.post("/activate", ActivateAccountPostController);

export default router;