import { Request, Response } from "express";
import { graphqlClient } from '../../@utils/graphqlRequestConfig';
import { gql } from "graphql-request";
import { Console } from "console";
import { asteriskMail } from "../../@utils/asteriskEmail";

export const signUpController = async (req:Request, res:Response) => {
    res.render("signup", { pageTitle: "Sign up"});
}

export const signInController = async (req: Request, res: Response) => {
  res.render("login", { pageTitle: "Sign in" });
};

export const activateAccountController = async (req: Request, res: Response) => {
  let email = req.headers.authorization || req.cookies.email;
  // console.log(email)
  email = await asteriskMail(email);

  res.render("activate", { pageTitle: "Activate account", email });
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
  let { email, username, country, password, fullname } = req.body;

  // mutation for create user

  const createAccountMutation = gql`
    mutation createAccount($Opts: CreateAccountInputs!) {
        createAccount(opts:$Opts) {
        code
        success
        message
        user {
          id
          email
        }
        token
      }
    }
  `;

  // const query = gql`
  //   query CheckUsername($username: String!) {
  //     checkIfUsernameExist(username:$username) {
  //       username
  //     }
  //   }
  // `;

  const variables = {
    Opts: {
      fullname,
      email,
      username,
      country,
      password
    }
  }

  graphqlClient.request(createAccountMutation, variables)
  .then(result => {
    console.log(`Payload data: `, result.createAccount.message);
    const { user, token } = result.createAccount;
    res.cookie("email", user.email, { httpOnly : true });
    res.cookie("x_user_token", token, { httpOnly: true });
    res.redirect('/activate');
  })
  .catch(e => {
    // console.log(`payload data error: `, e);
    console.log(`payload data error: `, e.response.errors[0].message);
    res.redirect("/signup");
  })

  // res.send("Good")
};

export const LoginPostController = async (req: Request, res: Response) => {
  res.json({
    msg: `You are signed in as @${req.body.username}`,
  });
};


export const ActivateAccountPostController = async (req: Request, res: Response) => {
  
};
