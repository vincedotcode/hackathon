const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth');
const uploadRoute = require('./routes/upload')
const recruitRoutes = require('./routes/recruits');
const jobRoutes = require('./routes/job')
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');

require('./config/firebase.js');
app.use(cors());
connectDB();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());


const PORT = process.env.PORT || 3000;
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'HR - API',
            version: '1.0.0'
        }
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/auth', authRoutes);
app.use('/upload', uploadRoute);
app.use('/recruits', recruitRoutes)
app.use('/jobs', jobRoutes)


app.listen(PORT, () => {
    console.log('Server running ' + PORT);
});
