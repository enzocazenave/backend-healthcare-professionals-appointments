import { Router } from "express";
import authControllers from "../controllers/auth.controllers";

const router = Router();

router.post("/register", [], authControllers.register);

router.post("/login", [], authControllers.login);

router.post("/refresh-token", [], authControllers.renewToken);

router.post("/logout", [], authControllers.logout);

router.post("/forgot-password", [], authControllers.forgotPassword);

router.post("/reset-password", [], authControllers.resetPassword);

export default router;