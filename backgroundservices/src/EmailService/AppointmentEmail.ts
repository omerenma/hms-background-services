import ejs from "ejs";
import { client } from "../config/database";
import dotenv from "dotenv";
import sendMail from "../Helpers/sendMail";
import { parse } from "json2csv";

const db = client.connect();
dotenv.config();

interface Appointment {
    id?:string,
    patient_name:string,
    doctor_email:string,
    date:string,
    patient_email:string,
    issent?:number
}
const AppointmentEmail = async () => {
    const sql = `SELECT * FROM appointments WHERE issent = 0`;
    const query = (await db).query(sql);
    const appointments: Appointment[] = (await query).rows;

    for (let appointment of appointments) {
        ejs.renderFile('templates/Appointment.ejs', {name:appointment.patient_name, date: appointment.date}, async (err, data) => {
            let messageoptions = {
                    from: process.env.EMAIL_SMTP_USER,
                    to: appointment.doctor_email,
                    subject: `Appointment has been scheduled for ${appointment.doctor_email} with ${appointment.patient_email} at ${appointment.date}`,
                    html: data,
            }
            try {
                await sendMail(messageoptions);
                const updateAppointments = `UPDATE patients SET issent=1 WHERE issent=0`;
                (await db).query(updateAppointments);
              } catch (error) {
                console.log(error);
              }
        })
    }

    
}
export default AppointmentEmail