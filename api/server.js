const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json(), express.urlencoded({ extended: true }));
const db_name = 'management';
require("./config/mongoose.config")(db_name);

 require('./routes/project.routes')(app);
require('./routes/user.routes')(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server run on port ${PORT}...`));
