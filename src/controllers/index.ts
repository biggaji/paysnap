import { Request, Response } from "express";

const indexController = async (req:Request,res:Response) => {
  if(req.headers.authorization || req.cookies.isLoggedIn) {
    let isLoggedIn = req.headers.authorization || req.cookies.isLoggedIn;

    if (isLoggedIn && isLoggedIn !== undefined) {
      res.redirect("/dashboard");
    } else {
      res.render("index", {
        pageTitle: "Send money around the world to anyone, anywhere, anytime",
      });
    };
  } else {
    res.render("index", {
      pageTitle:
        "Send money around the world to anyone, anywhere, anytime"
    });
  };
};

export default indexController;