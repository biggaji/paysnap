import { Router } from "express";
import indexController from "../controllers";


const router = Router();

router.get('/', indexController);

export default router;
