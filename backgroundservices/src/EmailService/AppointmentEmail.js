"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const database_1 = require("../config/database");
const dotenv_1 = __importDefault(require("dotenv"));
const sendMail_1 = __importDefault(require("../Helpers/sendMail"));
const db = database_1.client.connect();
dotenv_1.default.config();
const AppointmentEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT * FROM appointments WHERE issent = 0`;
    const query = (yield db).query(sql);
    const appointments = (yield query).rows;
    for (let appointment of appointments) {
        ejs_1.default.renderFile('templates/Appointment.ejs', { name: appointment.patient_name, date: appointment.date }, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            let messageoptions = {
                from: process.env.EMAIL_SMTP_USER,
                to: appointment.doctor_email,
                subject: `Appointment has been scheduled for ${appointment.doctor_email} with ${appointment.patient_email} at ${appointment.date}`,
                html: data,
            };
            try {
                yield (0, sendMail_1.default)(messageoptions);
                const updateAppointments = `UPDATE patients SET issent=1 WHERE issent=0`;
                (yield db).query(updateAppointments);
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
});
exports.default = AppointmentEmail;
