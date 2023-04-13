import dotenv from 'dotenv'
import {Pool} from 'pg'


dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB ,
    PGPORT,
    POSTGRES_DB_TEST,
    POSTGRES_USER ,
    POSTGRES_PASSWORD,
    ENV
} = process.env 


export const client = new Pool({
    host:POSTGRES_HOST,
    port: 5432,
    database:  POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
})

