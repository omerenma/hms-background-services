import express from "express"
import cron from "node-cron";
import dotenv from "dotenv";
import ReportEmail from "./EmailService/AdmissionReport";
import WelcomeEmail from "./EmailService/WelcomeEmail";
import AppointmentEmail from "./EmailService/AppointmentEmail";
import DiagnosisEmail from "./EmailService/DiagnosisEmail";
const app = express();
dotenv.config();

const run = () => {
  cron.schedule("* * * * *", () => {
    ReportEmail()
    WelcomeEmail()
    AppointmentEmail()
    DiagnosisEmail()
  });
};

run();
const port = 4500;

app.listen(port, () => {
  console.log(`Background Services running on port ${port}`);
});
