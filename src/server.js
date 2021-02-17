const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const listEndpoints = require('express-list-endpoints')

const articleRouter = require("./medium");
const authorRoute = require("./authors");

const {
    notFoundHandler,
    forbiddenHandler,
    badRequestHandler,
    genericErrorHandler
} = require('./errorHandlers')


const server = express();
const port = process.env.PORT || 3001


server.use(cors());
server.use(express.json());
server.use("/medium", articleRouter)
server.use("/authors", authorRoute);


server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

//console.log(listEndpoints(server))

mongoose.set("debug", true)

mongoose
    .connect(process.env.MONGO_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        server.listen(port, () => {
            console.log(port, "hunting femboys");
        })
    );