import ejs from "ejs";
import { client } from "../config/database";
import dotenv from "dotenv";
import sendMail from "../Helpers/sendMail";
import { parse } from "json2csv";

const db = client.connect();
dotenv.config();

export interface Diagnosis {
    id?:string;
    treatment_name:string;
    drug_administered:string;
    doctor_name:string;
    patient_email:string;
    bill:string;
    date:string;
    paid:string;
    description:string;
    patient_status:string;
    doctor_email:string;
    issent?:number
}
const DiagnosisEmail = async () => {
    const sql = `SELECT * FROM diagnosis WHERE issent = 0`;
    const query = (await db).query(sql);
    const diagnosis: Diagnosis[] = (await query).rows;

    for (let diagnos of diagnosis) {
        ejs.renderFile('templates/Diagnosis.ejs',
         {name:diagnos.patient_email, date: diagnos.date}, 
            async (err, data) => {
            let messageoptions = {
                    from: process.env.EMAIL_SMTP_USER,
                    to: diagnos.patient_email,
                    subject: `Diagnosi for ${diagnos.treatment_name}`,
                    html: data,
                    attatchment: [
                        {
                          filename: "diagnosis.txt",
                          content: `$${diagnos.description}`,
                        },
                      ],
            }
            try {
                await sendMail(messageoptions);
                const updateDiagnosis = `UPDATE diagnosis SET issent=1 WHERE issent=0`;
                (await db).query(updateDiagnosis);
              } catch (error) {
                console.log(error);
              }
        })
    }

    
}
export default DiagnosisEmail