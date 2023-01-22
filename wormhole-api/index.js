const express  = require('express')
const cors = require('cors')
const db = require('./config/mongoose')
const userRoute = require('./routes/users')


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user',userRoute);

app.listen(5000,console.log('listening on port 5000'));
