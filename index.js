const express = require('express');
const router = require('./routes/routes');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(router);


app.listen(3000, ()=>console.log('server loaded'))