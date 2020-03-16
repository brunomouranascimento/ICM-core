const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

require('./app/routes/routes')(app);

app.listen(3333);
