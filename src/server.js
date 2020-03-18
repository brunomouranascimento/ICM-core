const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

require('./app/routes/core/routes')(app);

app.listen(process.env.PORT || 3333);
