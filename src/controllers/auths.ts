import { Request, Response } from "express";

export const signUpController = async (req:Request, res:Response) => {
    res.render("signup", { pageTitle: "Sign up"});
}

export const signInController = async (req: Request, res: Response) => {
  res.render("login", { pageTitle: "Sign in" });
};

export const activateAccountController = async (req: Request, res: Response) => {
  res.render("activate", { pageTitle: "Activate account" });
};

export const resetPasswordController = async (
  req: Request,
  res: Response
) => {
  res.render("requestPasswordRequest", { pageTitle: "Request password reset"});
};

export const RedenderDashboardController = async (
  req: Request,
  res: Response
) => {
  res.render("dashboard", { pageTitle: "" , dashboard: ""});
};

export const CreateAccountPostController = async (req: Request,res: Response) => {
  res.json({
    "msg": `@${req.body.username}, your account has been created successfully`
  });
};

export const LoginPostController = async (req: Request, res: Response) => {
  res.json({
    msg: `You are signed in as @${req.body.username}`,
  });
};
