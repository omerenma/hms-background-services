"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_DB, PGPORT, POSTGRES_DB_TEST, POSTGRES_USER, POSTGRES_PASSWORD, ENV } = process.env;
exports.client = new pg_1.Pool({
    host: POSTGRES_HOST,
    port: 5432,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
});
