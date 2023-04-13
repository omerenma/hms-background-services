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
const json2csv_1 = require("json2csv");
const db = database_1.client.connect();
dotenv_1.default.config();
const ReportEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT * FROM patients WHERE issent = 0`;
    const query = (yield db).query(sql);
    const patients = (yield query).rows;
    if (patients.length) {
        const csv = (0, json2csv_1.parse)(patients);
        ejs_1.default.renderFile("templates/Report.ejs", (err, data) => __awaiter(void 0, void 0, void 0, function* () {
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
                yield (0, sendMail_1.default)(messageoption);
                const updatePatient = `UPDATE patients SET issent=1 WHERE issent=0`;
                (yield db).query(updatePatient);
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
});
exports.default = ReportEmail;
