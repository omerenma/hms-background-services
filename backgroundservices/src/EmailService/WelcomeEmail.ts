import ejs from "ejs";
import { client } from "../config/database";
import dotenv from "dotenv";
import sendMail from "../Helpers/sendMail";
import { parse } from "json2csv";

const db = client.connect();
dotenv.config();

interface User {
    id:number,
    name:string,
    email:string,
    role:string,
    issent:number,
}

const welcomeEmail = async () => {
    const sql = `SELECT * FROM users WHERE issent = 0`;
    const query = (await db).query(sql);
    const users: User[] = (await query).rows;

    for (let user of users) {
        ejs.renderFile('templates/Welcome.ejs', {name:user.name}, async (err, data) => {
            let messageoptions = {
                    from: process.env.EMAIL_SMTP_USER,
                    to: user.email,
                    subject: `Welcome ${user.name},  to Precious clinics.`,
                    html: data,
            }
            try {
                await sendMail(messageoptions);
                const updateUser = `UPDATE users SET issent=1 WHERE issent=0`;
                (await db).query(updateUser);
              } catch (error) {
                console.log(error);
              }
        })
    }

    
}
export default welcomeEmail