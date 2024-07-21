import { MailerSend, EmailParams, Recipient, Sender } from "mailersend";

// Configure MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

export async function sendOTP(email: string, otp: string) {
  const recipients = [new Recipient(email, "User")];
  const sentFrom = new Sender(
    "ajinkyajadhav80586@gmail.com",
    "MOON_ECOM",
  );

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Your OTP Code")
    .setHtml(`<p>Your OTP code is: <strong>${otp}</strong></p>`);

  try {
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}
