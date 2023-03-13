import {controller} from './../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR);
const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';

const prisma = new PrismaClient();

const authController: controller = {};

authController.createUser = async (req, res, next) => {
  const {firstName, lastName, email, password} = req.body;

  // validate request body
  const emailRequirements = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (
    typeof firstName !== 'string' ||
    !(firstName.length > 0) ||
    typeof lastName !== 'string' ||
    !(lastName.length > 0) ||
    typeof email !== 'string' ||
    !email.match(emailRequirements) ||
    typeof password !== 'string' ||
    !password.match(passwordRequirements)
  ) {
    return next({
      log: 'ERROR - authController.createUser: request body contains invalid type',
      status: 400,
      message: {err: 'Invalid form submission'},
    });
  }

  try {
    // verify account doesn't already exist with given email
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser !== null) {
      return next({
        log: 'ERROR - authController.createUser: user model already contains a record with the email in the request body',
        status: 400,
        message: {err: 'An account with this email already exists'},
      });
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        authProviderId: 1,
      },
    });

    res.locals.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      authProvider: 'Kalibrate',
    };

    return next();
  } catch (err) {
    return next({
      log: `ERROR - authController.createUser: ${err}`,
      status: 400,
      message: {err: 'Failed to create account'},
    });
  }
};
authController.verifyUser = async (req, res, next) => {
  const {email, password} = req.body;

  // validate types
  if (typeof email !== 'string' || typeof password !== 'string') {
    return next({
      log: 'ERROR - authController.verifyUser: request body contains invalid type',
      status: 400,
      message: {err: 'Invalid email or password'},
    });
  }

  try {
    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user === null) {
      return next({
        log: 'ERROR - authController.verifyUser: user model does not contain record with matching email',
        status: 400,
        message: {err: 'Invalid email or password'},
      });
    }

    // check if found user has a password set/signed up with Kalibrate
    if (user.password === null) {
      return next({
        log: 'ERROR - authController.verifyUser: found user does not have a password set and cannot be authenticated with provider Kalibrate',
        status: 400,
        message: {err: 'Invalid email or password'},
      });
    }

    // validate password
    const isAuthenticated = await bcrypt.compare(password, user.password);

    if (!isAuthenticated) {
      return next({
        log: 'ERROR - authController.verifyUser: found user model password does not match submitted password',
        status: 400,
        message: {err: 'Invalid email or password'},
      });
    }

    res.locals.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      authProvider: 'Kalibrate',
    };

    return next();
  } catch (err) {
    return next({
      log: `ERROR - authController.verifyUser: failed to verify user: ${err}`,
      status: 400,
      message: {err: 'Invalid email or password'},
    });
  }
};

authController.updateUser = async (req, res, next) => {
  const {newEmail, oldPass, newPass} = req.body;
  const {email} = res.locals.user;

  //AUTHENTICATE PASSWORD
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user === null) {
      return next({
        log: 'ERROR - authController.verifyUser: user model does not contain record with matching email',
        status: 400,
        message: {err: 'Invalid email or password'},
      });
    }

    // check if found user has a password set/signed up with Kalibrate
    if (user.password === null) {
      return next({
        log: 'ERROR - authController.verifyUser: found user does not have a password set and cannot be authenticated with provider Kalibrate',
        status: 400,
        message: {err: 'Invalid email or password'},
      });
    }
    const isAuthenticated = await bcrypt.compare(oldPass, user.password);
    if (!isAuthenticated) {
      return next({
        log: 'ERROR - authController.updateUser: found user model password does not match submitted password',
        status: 400,
        message: {err: 'Invalid email or password'},
      });
    }
  } catch (err) {
    return next({
      log: `ERROR - authController.updateUser: failed to verify user: ${err}`,
      status: 400,
      message: {err: 'Invalid email or password'},
    });
  }

  //UPDATE EMAIL
  if (newEmail) {
    try {
      console.log('updating email');
      if (typeof newEmail !== 'string') {
        return next({
          og: 'ERROR - authController.updateUser: email request body contains invalid type',
          status: 400,
          message: {err: 'Invalid form submission'},
        });
      }
      const updatedEmail = await prisma.user.update({
        where: {
          email,
        },
        data: {
          email: newEmail,
        },
      });
      if (!updatedEmail) throw 400;
      console.log('USER EMAIL UPDATED', updatedEmail);
    } catch (err) {
      return next({
        log: 'ERROR - authController.updateUser: failed to update user email',
        status: err,
        message: {err: 'Invalid update request'},
      });
    }
  }
  //UPDATE PASSWORD
  if (newPass) {
    try {
      const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (typeof newPass !== 'string' || !newPass.match(passwordRequirements)) {
        return next({
          log: 'ERROR - authController.updateUser: request body contains invalid type',
          status: 400,
          message: {err: 'Invalid form submission'},
        });
      }

      const hashedPassword = await bcrypt.hash(newPass, SALT_WORK_FACTOR);
      const updatedPass = await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });
      if (!updatedPass) throw 400;
      console.log('USER PASSWORD UPDATED', updatedPass);
    } catch (err) {
      return next({
        log: 'ERROR - authController.updateUser: failed to update user password',
        status: err,
        message: {err: 'Invalid update request'},
      });
    }
  }
  return next();
};

//need to update to post with list of email to send to
authController.sendResetPassword = async (req, res, next) => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const {email} = req.body;
  const msg = {
    to: [email],
    from: {name: 'Kalibrate', email: process.env.SENDGRID_EMAIL},
    subject: 'Reset Password',
    template_id: 'd-f274c453eb934a73bd3018bc4aa20493',
  };
  try {
    await sgMail.send(msg);
    console.log('sent!');
  } catch (error) {
    console.error(error);
    return next({
      log: `ERROR - adminController.sendResetPassowrd failed to send rest email`,
      status: 400,
      message: {err: 'Failed to fetch cluster group data'},
    });
  }
};
authController.resetPassword = async (req, res, next) => {
  const {email, newPass} = req.body;
  try {
    const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (typeof newPass !== 'string' || !newPass.match(passwordRequirements)) {
      return next({
        log: 'ERROR - authController.resetPassword: request body contains invalid type',
        status: 400,
        message: {err: 'Invalid form submission'},
      });
    }

    const hashedPassword = await bcrypt.hash(newPass, SALT_WORK_FACTOR);
    const updatedPass = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
    if (!updatedPass) throw 400;
    console.log('USER PASSWORD UPDATED', updatedPass);
  } catch (err) {
    return next({
      log: 'ERROR - authController.updateUser: failed to update user password',
      status: err,
      message: {err: 'Invalid update request'},
    });
  }
  return next();
};
authController.setSessionCookie = (req, res, next) => {
  const {id, firstName, lastName, email, authProvider} = res.locals.user;

  // set cookie with encrypted payload of user info
  const sessionToken = jwt.sign({id, firstName, lastName, email, authProvider}, JWT_SECRET);
  res.cookie('kst', sessionToken, {httpOnly: true}); // KST short for Kalibrate Session Token

  return next();
};

authController.verifySessionCookie = (req, res, next) => {
  // check for KST session cookie
  if (!Object.hasOwn(req.cookies, 'kst')) {
    return next({
      log: `ERROR - authController.verifySessionCookie: Failed to extract session cookie.`,
      status: 440,
      message: {err: 'User is not authenticated.'},
    });
  }
  // decrypt session token from session cookie
  const {kst} = req.cookies; // KST short for Kalibrate Session Token
  jwt.verify(kst, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return next({
        log: `ERROR - authController.verifySessionCookie, failed to verify session token: ${err}`,
        status: 440,
        message: {err: 'User is not authenticated.'},
      });
    }
    res.locals.user = decoded;

    return next();
  });
};

authController.clearSessionCookie = (req, res, next) => {
  res.clearCookie('kst'); // KST short for Kalibrate Session Token

  return next();
};

export default authController;
