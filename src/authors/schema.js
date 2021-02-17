
const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const AuthorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surename: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "author"],
            required: true,
        },
        articles: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
    },
    { timestamps: true }
);

AuthorSchema.statics.findByCredentials = async function (email, password) {
    const author = await this.findOne({ email })
    if (author) {
        const isMatch = await bcrypt.compare(password, author.password)
        if (isMatch) return author;
        else return null
    } else return null
}

AuthorSchema.methods.toJSON = function () {
    const author = this
    const userObject = author.toObject()

    delete userObject.password
    delete userObject.__v

    return userObject

}

AuthorSchema.pre("save", async function (next) {
    const author = this
    if (author.isModified("password")) {
        author.password = await bcrypt.hash(author.password, 10)
    }
    next()
})

module.exports = model("User", AuthorSchema)