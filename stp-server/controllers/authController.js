const bcrypt = require("bcrypt");
const User = require("../models/User");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
dotenv.config();

const generateToken = (data) => (
  jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "12h",
  }))



const signupController = (req, res) => {
  if (Object.keys(req.body).length < 1) {
    res.status(500).json({
      code: 500,
      message: "Please provide a valid data!",
    });
  }
  else {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          if (user[0].email === req.body.email) {
            return res.status(404).json({
              code: 404,
              message: "The email address already in use. please try to another email address!",
            });
          }
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              res.status(404).json({
                error: err,
              });
            } else {
              const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
              });
              user
                .save()
                .then(async (success) => {
                  const token = generateToken({
                    username: user.username,
                    email: user.email,
                    password: hash,
                    _id: user._id
                  });
                  
                  res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "development",
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60 * 1000 // Optional: Cookie expiry (e.g., 1 day in milliseconds)
                  });

                  res.status(200).json({
                    message: "User Created Successfully!",
                    code: 200,
                    success: true,
                  });
                })
                .catch((err) => {
                  res.status(405).json({
                    error: err,
                  });
                });
            }
          });
        }
      });
  }
};





const signinController = (req, res) => {
  console.log("Request for signin:", req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            res.status(404).json({
              message: "Auth field",
              code: 404,
              success: false,
              ok: false,
            });
          } else if (result) {
            user.password = req.body.password;
            const token = generateToken({ user });
            res.cookie("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "development",
              sameSite: "strict",
              maxAge: 24 * 60 * 60 * 1000 // Optional: Cookie expiry (e.g., 1 day in milliseconds)
            });

            res.status(200).json({
              message: "Login Successful!",
              code: 200,
              success: true,
              ok: true,
            });
          } else {
            res.status(404).json({
              message: "Invalid email or password!",
              code: 404,
              success: false,
              ok: false,
            });
          }
        });
      } else {
        res.status(404).json({
          message: "Invalid email or password!",
          code: 404,
          success: false,
          ok: false,
        });
      }
    }).catch((err) => {
      res.status(500).json({
        error: "err",
        success: false,
      });
    });
};



const getUserController = async (req, res) => {
  try {
    const userId = req.user.user ? req.user.user._id : req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User not found. Ensure your token contains a valid id."
      });
    }
    res.status(200).json({
      code: 200,
      message: "User retrieved successfully!",
      data: {
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message
    });
  }
};











const logoutController = (req, res) => {
  try {
    // Get the token from the cookie
    const token = req.cookies.token;

    console.log("Request for logout:", req.cookies);
    if (!token) {
      return res.status(400).json({
        message: "No token found, already logged out",
        code: 400,
        success: false,
        ok: false,
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
    });
    // Send success response
    res.status(200).json({
      message: "Logout successful!",
      code: 200,
      success: true,
      ok: true,
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Server error during logout",
      code: 500,
      success: false,
      ok: false,
    });
  }
};







// async function sendEmailFunc(user, restoSend) {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465, // Use SSL
//     secure: true, // Use SSL
//     auth: {
//       user: "maddison53@ethereal.email",
//       pass: "jn7jnAPss4f63QBp6D",
//     },
//   });
//   const mailOption = {
//     from: "support@gathertown.com",
//     to: user.email,
//     subject: "Temporary link to Reset Password",
//     html: `<p>Click this link to</p>
//     <a href=${process.env.CLIENT_BASE_URL}/reset-password/
//      ${user.token} method=POST >Reset password</a> <p>for SMS-Senseflow user  ${user.username} </p>`,
//   };
//   transporter.sendMail(mailOption, function (error, res) {
//     if (res) {
//       restoSend.status(200).json({
//         code: 200,
//         status: "success",
//         message: `A reset password link has been sent to ${user.email} which is associated to ${user.username}`,
//         redirectURL: `${process.env.CLIENT_BASE_URL}/reset-password/${user.token}`,
//       });
//     } else {
//       res.status(404).json({
//         error,
//       });
//     }
//   });
// }

module.exports = { signupController, signinController, generateToken, getUserController, logoutController };
