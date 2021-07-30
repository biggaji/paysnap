import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the fastest and easiest payment platform in the world",
    Path: "/transaction"
  });
});

export default router;
