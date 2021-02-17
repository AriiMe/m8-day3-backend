const express = require("express");
const AuthorSchema = require("./schema");
const { adminOnly, basic } = require('../authTools')


const authorRouter = express.Router();


authorRouter.get("/", basic, adminOnly, async (req, res, next) => {
    try {
        const users = await AuthorSchema.find()
        res.send(users)
    } catch (error) {
        next(error)

    }
})

authorRouter.post("/signup", async (req, res, next) => {
    try {
        const newAuthor = await AuthorSchema(req.body)
        const { _id } = await newAuthor.save()

        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

authorRouter.get("/:id", async (req, res) => {
    try {
        const selectedAuthor = await AuthorSchema.findById(req.params.id).populate(
            "articles"
        );
        if (selectedAuthor) {
            res.status(200).send(selectedAuthor);
        } else {
            res.status(404).send("author with that id not found");
        }
    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});

authorRouter.delete("/me", basic, async (req, res, next) => {
    try {
        await req.user.deleteOne()
        res.status(204).send("yeeted")
    } catch (error) {
        next(error)
    }
})

authorRouter.put("/me", basic, async (req, res, next) => {
    try {
        const updates = Object.keys(req.body)
        console.log("Updates", updates)

        updates.forEach(update => (req.user[update] = req.body[update]))
        await req.user.save()
        res.send(req.user)

        res.send(updates)
    } catch (error) {
        next(error)
    }
})
module.exports = authorRouter;