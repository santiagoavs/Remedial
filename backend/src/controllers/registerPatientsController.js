import jsonwebtoken from "jsonwebtoken"; 
import bcryptjs from "bcryptjs"; 
import nodemailer from "nodemailer"; 
import crypto from "crypto"; 
import PatientsModel from "../models/patients.js";
import { config } from "../config.js";

const registerPatientsController = {};

registerPatientsController.register = async (req, res) => {
  const {
    name,
    age,
    email,
    password,
    telephone,
    isVerified,
  } = req.body;

  try {
    const existsClient = await clientsModel.findOne({ email });
    if (existsClient) {
      return res.json({ message: "Client already exists" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newClient = new clientsModel({
      name,
      age,
      email,
      password: passwordHash,
      telephone,
      isVerified: isVerified || false,
    });

    await newClient.save();

    const verificationCode = crypto.randomBytes(3).toString("hex");

    const tokenCode = jsonwebtoken.sign(
      { email, verificationCode },
      config.JWT.secret,
      { expiresIn: "2h" }
    );

    res.cookie("VerificationToken", tokenCode, { maxAge: 2 * 60 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.email_user,
        pass: config.email.email_pass,
      },
    });

    const mailOptions = {
      from: config.email.email_user,
      to: email,
      subject: "Verificación de correo",
      text: `Para verificar tu correo, utiliza el 
        siguiente código ${verificationCode}\n El codigo 
        vence en dos horas`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.json({ message: "Error" });

      console.log("Correo enviado" + info.response);
    });

    res.json({
      message: "Client registered. Please verify your email whit the code sent",
    });
  } catch (error) {
    res.json({ message: "Error" + error });
  }
};

registerPatientsController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;

  const token = req.cookies.VerificationToken;

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    if (verificationCode !== storedCode) {
      return res.json({ message: "Invalid code" });
    }

    const client = await clientsModel.findOne({ email });
    client.isVerified = true;
    await client.save();

    res.json({ message: "Email verified successfull" });

    res.clearCookie("VerificationToken");
  } catch (error) {
    res.json({ message: "error" });
  }
};

export default registerPatientsController;
