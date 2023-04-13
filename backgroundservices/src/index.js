"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
const AdmissionReport_1 = __importDefault(require("./EmailService/AdmissionReport"));
const WelcomeEmail_1 = __importDefault(require("./EmailService/WelcomeEmail"));
const AppointmentEmail_1 = __importDefault(require("./EmailService/AppointmentEmail"));
const DiagnosisEmail_1 = __importDefault(require("./EmailService/DiagnosisEmail"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const run = () => {
    node_cron_1.default.schedule("* * * * *", () => {
        (0, AdmissionReport_1.default)();
        (0, WelcomeEmail_1.default)();
        (0, AppointmentEmail_1.default)();
        (0, DiagnosisEmail_1.default)();
    });
};
run();
const port = 4500;
app.listen(port, () => {
    console.log(`Background Services running on port ${port}`);
});
