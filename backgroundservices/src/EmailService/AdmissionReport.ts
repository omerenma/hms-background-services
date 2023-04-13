import ejs from "ejs";
import { client } from "../config/database";
import dotenv from "dotenv";
import sendMail from "../Helpers/sendMail";
import { parse } from "json2csv";

const db = client.connect();
dotenv.config();

interface Patient {
  name: string;
  residential_address: string;
  room_admitted: string;
  admission_no: string;
  id_no: string;
  email: string;
  phone_number: string;
  next_of_kin_name: string;
  next_of_kin_phone_no: string;
  issent: number;
  status: string;
}
const ReportEmail = async () => {
  const sql = `SELECT * FROM patients WHERE issent = 0`;
  const query = (await db).query(sql);
  const patients: Patient[] = (await query).rows;
  if (patients.length) {
    const csv = parse(patients);
    ejs.renderFile("templates/Report.ejs", async (err, data) => {
      let messageoption = {
        from: process.env.EMAIL_SMTP_USER,
        to: process.env.EMAIL_SMTP_USER,
        subject: "Hi here is your daily report",
        html: data,
        attatchment: [
          {
            filename: "DailyReport.csv",
            content: csv,
          },
        ],
      };
      try {
        await sendMail(messageoption);
        const updatePatient = `UPDATE patients SET issent=1 WHERE issent=0`;
        (await db).query(updatePatient);
      } catch (error) {
        console.log(error);
      }
    });
  }
};

export default ReportEmail;
