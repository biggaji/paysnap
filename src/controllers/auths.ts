import { Request, Response } from "express";
import { graphqlClient } from '../../@utils/graphqlRequestConfig';
import { gql } from "graphql-request";
import { Console } from "console";
import { asteriskMail } from "../../@utils/asteriskEmail";
import { checkUserByEmail, checkUserByUsername } from "../../@utils/checkUserExists";
import { compare } from "bcryptjs";

export const signUpController = async (req:Request, res:Response) => {
    res.render("signup", { pageTitle: "Sign up"});
}

export const signInController = async (req: Request, res: Response) => {
  res.render("login", { pageTitle: "Sign in" });
};

export const activateAccountController = async (req: Request, res: Response) => {
  let email = req.headers.authorization || req.cookies.email;
  let hashedEmail;

  if(email && email !== undefined) {
    hashedEmail = await asteriskMail(email);
  }
  // console.log(email)

  res.render("activate", { pageTitle: "Activate account", hashedEmail });
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

  // get user data database

   
  res.render("dashboard", { pageTitle: "" , dashboard: "", username: "biggaji"});
};

export const CreateAccountPostController = async (req: Request,res: Response) => {
  let { email, username, country, password, fullname } = req.body;

  // mutation for create user

  let checkUser = await checkUserByEmail(email);
  console.log('User with email Exist ', checkUser);

  if(!checkUser) {
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
    });
  } else {
    console.log("User exists");
    res.redirect("/signup");
  }


  // res.send("Good")
};

export const LoginPostController = async (req: Request, res: Response) => {

  const { username, password } = req.body;

  const checkUserFirst = await checkUserByUsername(username);

  if(!checkUserFirst) {
    console.log('There is no user yet', checkUserFirst);
    res.redirect('/signin');
  } else {
    const loginQuery = gql`
        query Signin($opts: LoginInputs!) {
          login(opts:$opts) {
            user {
              id
              isactivated
              password
            }
            token
          }
        }
    `;
  
    let variables = {
        opts: {
          username,
          password
        }
    };
  
  
    graphqlClient.request(loginQuery,variables)
    .then(async resp => {

      // compare password

      let isPassword = await compare(password, resp.login.user.password);

      if(!isPassword) {
        console.log('Incorrect password');
        res.redirect('/signin');
      } 

      console.log(`login Payload `, resp.login.user.id);
      res.redirect('/dashboard');
    })
    .catch(e => {
      console.log(`Login error ,`, e);
      res.redirect('/signin');
    });
  }
};


export const ActivateAccountPostController = async (req: Request, res: Response) => {
  const { code } = req.body;
  console.log(code)
  // get token form cookie

  let tokenPayload = await req.headers.authorization || req.cookies.x_user_token;

  // send token to database

  const activateAccountMutation = gql`
      mutation activateAccount($code: String!) {
        activateAccount(code: $code) {
          code
          message
          success
          user {
            isactivated
          }
        }
      }
  `;

  const variables = {
    code
  };

  const request_header = {
    "x_user_token" : tokenPayload
  }

  graphqlClient.request(activateAccountMutation, variables, request_header)
  .then(resp => {
    let data = resp.activateAccount;
    console.log(`Account activated, ` , data.user.isactivated);
    // clear users email from cookie
    res.clearCookie("email");
    // redirect to dashboard
    res.redirect('/dashboard');
  })
  .catch(e => {
    console.log(`Activate Account error: `, e);
    res.redirect('/activate');
  });
};