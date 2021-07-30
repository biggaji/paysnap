import { Request, Response } from "express";

export const signUpController = async (req:Request, res:Response) => {
    res.render("signup", { pageTitle: "Create your paysnap account"});
}

export const signInController = async (req: Request, res: Response) => {
  res.render("login", { pageTitle: "Sign in to paysnap" });
};

export const activateAccountController = async (req: Request, res: Response) => {
  res.render("activate", { pageTitle: "Activate your paysnap account" });
};