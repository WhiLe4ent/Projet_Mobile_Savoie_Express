import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const API_URL = process.env.API_URL;
const APP_URL = process.env.APP_URL;

app.post("/send-email", async (req, res) => {
  const { to, subject, delivery, title, deliveryId } = req.body;

  try {
    const appUrl = `http://${API_URL}/url`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailText= `
    Bonjour,

    Votre livraison intitulée "{{title}}" a été mise à jour.

    Statut de la livraison: {{delivery}}
    ID de la livraison: {{deliveryId}}

    Merci d'utiliser SavoieExpress pour vos besoins de livraison.
    `;

    // Build the email HTML dynamically
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
            <h2 style="color: #0066cc; text-align: center;">Mise à jour de la livraison</h2>
            <p>Bonjour,</p>
            <p>
              Nous vous informons que votre livraison intitulée 
              <strong>${title}</strong> a été mise à jour.
            </p>
            <p>
              Statut de la livraison : <strong>${delivery}</strong>
            </p>
            <p>
              ID de la livraison : <strong>${deliveryId}</strong>
            </p>
            <p>
              Merci d'utiliser <strong>SavoieExpress</strong> pour vos besoins de livraison. 
              Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://192.168.1.92:3000/url"
                 style="text-decoration: none; padding: 10px 20px; background-color: #0066cc; color: white; border-radius: 5px; display: inline-block;"
              >
                Visitez notre site
              </a>
            </div>
            <p style="font-size: 0.9em; color: #999; text-align: center; margin-top: 20px;">
              Cet e-mail est généré automatiquement. Veuillez ne pas y répondre.
            </p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: emailHtml,
      text: emailText
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

app.get("/url", async (req, res) => {
  res.redirect("exp://" + APP_URL); 
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
