import { Request, Response } from "express";

const indexController = async (req:Request,res:Response) => {
    res.render("index", {
      pageTitle:
        "Send money around the world to anyone, anywhere, anytime"
    });
};

export default indexController;