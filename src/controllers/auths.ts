import { Request, Response } from "express";
import { graphqlClient } from '../../@utils/graphqlRequestConfig';
import request, { gql } from "graphql-request";
import { asteriskMail } from "../../@utils/asteriskEmail";
import { checkUserByEmail, checkUserByUsername } from "../../@utils/checkUserExists";
import { compare } from "bcryptjs";
import { decrypt, encrypt } from "../../@utils/encrypter";

export const signUpController = async (req:Request, res:Response) => {
    res.render("signup", { pageTitle: "Sign up", server_error_msg: req.flash("error")});
}

export const signInController = async (req: Request, res: Response) => {
  res.render("login", { pageTitle: "Sign in" , server_error_msg: req.flash("error")});
};

export const activateAccountController = async (req: Request, res: Response) => {
  let encodedEmail = req.headers.authorization || req.cookies.ee;
  let hashedEmail, email;

  email = await decrypt(encodedEmail);

  if(encodedEmail && encodedEmail !== undefined) {
    hashedEmail = await asteriskMail(email);
  }

  res.render("activate", { pageTitle: "Activate your account", hashedEmail , server_error_msg: req.flash("error")});
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
    .then(async result => {
      console.log(`Payload data: `, result.createAccount.message);
      const { user, token } = result.createAccount;

      // encrypt email into base64 hash and name it ee in cookie
      let ee = await encrypt(user.email);

      res.cookie("ee", ee , { secure: true });
      res.cookie("x_user_token", token, { httpOnly: true });
      res.redirect('/activate');
    })
    .catch(e => {
      // console.log(`payload data error: `, e);
      console.log(`payload data error: `, e.response.errors[0].message);
      req.flash("error", "An error occured while creating account, please try again");
      res.redirect("/signup");
    });
  } else {
    console.log("User exists");
    req.flash("error", "A user with this account already exist, please sign-in instead");
    res.redirect("/signup");
  }


  // res.send("Good")
};

export const LoginPostController = async (req: Request, res: Response) => {

  const { username, password } = req.body;

  const checkUserFirst = await checkUserByUsername(username);

  if(!checkUserFirst) {
    console.log('There is no user yet', checkUserFirst);
    req.flash("error", "You don't have a Paysnap account, please create one.");
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
        req.flash("error", "Incorrect username or password");
        res.redirect('/signin');
      } else {
        console.log(`login Payload `, resp.login.user.id);
        res.cookie("x_user_token", resp.login.token, { httpOnly: true });
        res.cookie('isLoggedIn', true, { httpOnly : true });
        res.clearCookie("isLoggedOut");
        res.redirect('/dashboard');
      };
    })
    .catch(e => {
      console.log(`Login error ,`, e);
      req.flash("error", "An error occured during signin, please try again");
      res.redirect('/signin');
    });
  }
};


export const ActivateAccountPostController = async (req: Request, res: Response) => {
  const { code } = req.body;

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
    // clear user email from cookie
    res.clearCookie("ee");
    res.cookie("isLoggedIn", true, { httpOnly : true });
    // redirect to dashboard
    res.redirect('/dashboard');
  })
  .catch(e => {
    console.log(`Activate Account error: `, e);
    if(e && e.response.errors) {
      req.flash("error", e.response.errors[0].message);
    }

    req.flash("error", "An error occured while activating account, please try again");
    res.redirect('/activate');
  });
};

// export const resendActivationCode = async (req: Request, res: Response) => {
//   let email = req.headers.authorization || req.cookies.ee;

//   // decrypt email hash - ee

//   email = await decrypt(email);

//   let resendActivationCodePayload = gql`
//     query resendActivationCode($email: String!) {
//       resendActivationCode(email: $email) {
//         code
//         success
//         message
//         activation_code
//       }
//     }
//   `;

//   let variable = {
//     email
//   };

//   graphqlClient.request(resendActivationCodePayload, variable)
//   .then(resp => {.

//   })
//   .catch(e => {
//     console.log(`RESEND ACTIVATION CODE ERROR `,  e);
//     if (e && e.response.errors) {
//       req.flash("error", e.response.errors[0].message);
//     };

//     req.flash("error", "Token not sent, try again");
//     res.redirect('/activate');
//   });

// };