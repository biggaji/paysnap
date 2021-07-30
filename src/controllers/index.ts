import { Request, Response } from "express";

const indexController = async (req:Request,res:Response) => {
    res.render("index", {
        pageTitle: "Paysnap - Welcome to the future of payments"
    });
};

export default indexController;