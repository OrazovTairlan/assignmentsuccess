// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const ejs = require("ejs");
const puppeteer = require("puppeteer");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const quizRoutes = require("./routes/quiz");
const itemRoutes = require("./routes/items");
const ItemModel = require("./models/ItemModel");
const authRoutes = require("./routes/auth");

// Initialize Express app
const app = express();
require("web-streams-polyfill");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

const HistoryModel = require("./models/HistoryModel");

const ThesaurusModel = require("./models/ThesaurusModel");
const AnimalsModel = require("./models/AnimalsModel");
const UserModel = require("./models/UserModel");

mongoose
    .connect(
        "mongodb+srv://successanonym:7755777@cluster0.4otig.mongodb.net/success?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    )
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Translation data
let active = "en";
const translate = require("./models/translate");

app.get("/translate", async (req, res) => {
    active = active === "ru" ? "en" : "ru";
    try {
        const users = await UserModel.find({}).lean();
        const animals = await AnimalsModel.find({}).lean();
        const thesaurus = await ThesaurusModel.find({}).lean();
        const pipeline = [
            // Lookup user by ID
            {
                $match: {_id: new mongoose.mongo.ObjectId(req.params.id)},
            },
            // Project only required fields
            {
                $project: {username: 1, isAdmin: 1, creationDate: 1, updateDate: 1},
            },
            // Lookup history by userId
            {
                $lookup: {
                    from: "histories",
                    localField: "_id",
                    foreignField: "userId",
                    as: "history",
                },
            },
        ];
        const history = await UserModel.aggregate(pipeline);
        res.render("charts", {
            users: users,
            animals: animals,
            thesaurus: thesaurus,
            history: history[0],
            translate: translate[active],
        });
    } catch (err) {
        console.error("Error fetching translation data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.use(adminRoutes);
app.use(userRoutes);
app.use(authRoutes);

app.use(quizRoutes)





app.use(itemRoutes)
// Charts Route
app.get("/charts/:id", async (req, res) => {
    try {
        const users = await UserModel.find({}).lean();
        const animals = await AnimalsModel.find({}).lean();
        const thesaurus = await ThesaurusModel.find({}).lean();
        const pipeline = [
            // Lookup user by ID
            {
                $match: {_id: new mongoose.mongo.ObjectId(req.params.id)},
            },
            // Project only required fields
            {
                $project: {username: 1, isAdmin: 1, creationDate: 1, updateDate: 1},
            },
            // Lookup history by userId
            {
                $lookup: {
                    from: "histories",
                    localField: "_id",
                    foreignField: "userId",
                    as: "history",
                },
            },
        ];
        const history = await UserModel.aggregate(pipeline);
        res.render("charts", {
            users: users,
            animals: animals,
            thesaurus: thesaurus,
            history: history[0],
            translate: translate[active],
        });
    } catch (err) {
        console.error("Error fetching data for charts:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/animals", async (req, res) => {
    console.log(req.query);
    if (Boolean(req.query.value) == true) {
        try {
            const result = await axios.get("https://api.api-ninjas.com/v1/animals", {
                params: {
                    name: req.query.value,
                },
                headers: {
                    "X-Api-Key": "PLTZf0U4hgA9wCYJkx5fbw==Fb1lDyLYBhRu2vxO",
                },
            });

            console.log(result.data);

            let foundedAnimals = await AnimalsModel.find({
                name: result.data[0].name,
            }).lean();
            if (foundedAnimals.length == 0) {
                await AnimalsModel.create({
                    ...result.data[0],
                });

                foundedAnimals = await AnimalsModel.find({
                    name: result.data[0].name,
                }).lean();
            }

            await HistoryModel.create({
                userId: req.query.id,
                prompt: req.query.value,
                creationDate: new Date(),
                type: "animals",
                isAnswer: Boolean(foundedAnimals.taxonomy) == true,
            });
            res.json({
                animals: foundedAnimals,
            });
        } catch (err) {
            console.error("Error fetching country data:", err);
            res.status(500).send("Internal Server Error");
        }
    } else {
        try {
            res.render("animals", {
                translate: translate[active],
            });
        } catch (err) {
            console.error("Error fetching country data:", err);
            res.status(500).send("Internal Server Error");
        }
    }
});

// Country Route
app.get("/thesaurus", async (req, res) => {
    console.log(req.query);
    if (Boolean(req.query.value) == true) {
        try {
            const result = await axios.get(
                "https://api.api-ninjas.com/v1/thesaurus",
                {
                    params: {
                        word: req.query.value,
                    },
                    headers: {
                        "X-Api-Key": "PLTZf0U4hgA9wCYJkx5fbw==Fb1lDyLYBhRu2vxO",
                    },
                },
            );

            console.log(result.data);

            let foundedAnimals = await ThesaurusModel.find({
                word: result.data.word,
            }).lean();
            if (foundedAnimals.length == 0) {
                await ThesaurusModel.create({
                    ...result.data,
                });

                foundedAnimals = await ThesaurusModel.find({
                    word: result.data.word,
                }).lean();
            }

            await HistoryModel.create({
                userId: req.query.id,
                prompt: req.query.value,
                creationDate: new Date(),
                type: "thesaurus",
                isAnswer: foundedAnimals[0].synonyms.length > 0,
            });
            res.json({
                thesaurus: foundedAnimals,
            });
        } catch (err) {
            console.error("Error fetching country data:", err);
            res.status(500).send("Internal Server Error");
        }
    } else {
        try {
            res.render("thesaurus", {
                translate: translate[active],
            });
        } catch (err) {
            console.error("Error fetching country data:", err);
            res.status(500).send("Internal Server Error");
        }
    }
});


app.get("/main", async (req, res) => {
    let items = await ItemModel.find({}).lean()
    items = items.map((item) => {
        return {
            ...item,
            images: [
                item.imageFirst,
                item.imageSecond,
                item.imageThree,
            ],
            name: {
                kz: item.name.kz,
                en: item.name.en
            },
            description: {
                kz: item.description.kz,
                en: item.description.en
            },
        }
    })
    res.render("main", {
        items: items
    })
})

// PDF Download Route
app.get("/pdfdownload/:id", (req, res) => {
    res.render("pdfpage", {
        translate: translate[active],
        id: req.params.id,
    });
});

// PDF Generation Route
app.get("/pdfhistory", async (req, res) => {
    if (req.query.type === "userHistory") {
        try {
            let userHistory = [];
            let templatePath = "";
            let outputPath = "./history.pdf";

            // Utility function to convert EJS to PDF
            async function convertEJStoPDF(templatePath, data, outputPath) {
                const browser = await puppeteer.launch({
                    timeout: 0,
                    protocolTimeout: 0,
                });
                const page = await browser.newPage();
                console.log(data[0].history, "hereeeeeeeeeee");
                const htmlContent = await ejs.renderFile(templatePath, {
                    userHistory: data,
                    translate: translate[active],
                });

                await page.setContent(htmlContent);
                await page.pdf({path: outputPath, timeout: 0, format: "A4"});
                await browser.close();

                console.log(`PDF generated successfully at: ${outputPath}`);
            }

            const pipeline = [
                // Lookup user by ID
                {
                    $match: {_id: new mongoose.mongo.ObjectId(req.query.id)},
                },
                // Project only required fields
                {
                    $project: {username: 1, isAdmin: 1, creationDate: 1, updateDate: 1},
                },
                // Lookup history by userId
                {
                    $lookup: {
                        from: "histories",
                        localField: "_id",
                        foreignField: "userId",
                        as: "history",
                    },
                },
            ];

            // Execute the aggregate query
            userHistory = await UserModel.aggregate(pipeline);
            console.log(userHistory);

            templatePath = "./public/historyUser.ejs";

            await convertEJStoPDF(templatePath, userHistory, outputPath);
            res.sendFile(__dirname + "/history.pdf");
        } catch (err) {
            console.error("Error generating PDF:", err);
            res.status(500).send("Internal Server Error");
        }
    }
    if (req.query.type === "userList") {
        try {
            let userHistory = [];
            let templatePath = "";
            let outputPath = "./history.pdf";

            // Utility function to convert EJS to PDF
            async function convertEJStoPDF(templatePath, data, outputPath) {
                const browser = await puppeteer.launch({
                    timeout: 0,
                    protocolTimeout: 0,
                });
                const page = await browser.newPage();
                const htmlContent = await ejs.renderFile(templatePath, {
                    userList: data,
                    translate: translate[active],
                });

                await page.setContent(htmlContent);
                await page.pdf({path: outputPath, timeout: 0, format: "A4"});
                await browser.close();

                console.log(`PDF generated successfully at: ${outputPath}`);
            }

            // Execute the aggregate query
            userHistory = await UserModel.find({}).lean();
            console.log(userHistory);

            templatePath = "./public/userList.ejs";

            await convertEJStoPDF(templatePath, userHistory, outputPath);
            res.sendFile(__dirname + "/history.pdf");
        } catch (err) {
            console.error("Error generating PDF:", err);
            res.status(500).send("Internal Server Error");
        }
    }
    if (req.query.type === "charts") {
        try {
            let userHistory = [];
            let templatePath = "";
            let outputPath = "./history.pdf";
            const users = await UserModel.find({}).lean();
            const animals = await AnimalsModel.find({}).lean();
            const thesaurus = await ThesaurusModel.find({}).lean();
            const pipeline = [
                // Lookup user by ID
                {
                    $match: {_id: new mongoose.mongo.ObjectId(req.query.id)},
                },
                // Project only required fields
                {
                    $project: {username: 1, isAdmin: 1, creationDate: 1, updateDate: 1},
                },
                // Lookup history by userId
                {
                    $lookup: {
                        from: "histories",
                        localField: "_id",
                        foreignField: "userId",
                        as: "history",
                    },
                },
            ];
            const history = await UserModel.aggregate(pipeline);

            // Utility function to convert EJS to PDF
            async function convertEJStoPDF(templatePath, data, outputPath) {
                const browser = await puppeteer.launch({
                    timeout: 0,
                    protocolTimeout: 0,
                });
                const page = await browser.newPage();
                console.log(animals, users, thesaurus, history[0]);
                const htmlContent = await ejs.renderFile(templatePath, {
                    users: users,
                    country: [],
                    userHistory: [],
                    animals: animals,
                    thesaurus: thesaurus,
                    history: history[0],
                    translate: translate[active],
                });

                await page.setContent(htmlContent);
                await new Promise((r) => setTimeout(r, 2000));
                await page.pdf({path: outputPath, timeout: 0, format: "A4"});
                await browser.close();

                console.log(`PDF generated successfully at: ${outputPath}`);
            }

            templatePath = "./public/charts.ejs";

            await convertEJStoPDF(templatePath, userHistory, outputPath);
            res.sendFile(__dirname + "/history.pdf");
        } catch (err) {
            console.error("Error generating PDF:", err);
            res.status(500).send("Internal Server Error");
        }
    }
    if (req.query.type === "commonData") {
        console.log("hereeeeeeeeeeeeeeeeee");
        try {
            let userHistory = [];
            let templatePath = "";
            let outputPath = "./history.pdf";

            // Utility function to convert EJS to PDF
            async function convertEJStoPDF(templatePath, data, outputPath) {
                const browser = await puppeteer.launch({
                    timeout: 0,
                    protocolTimeout: 0,
                });
                const page = await browser.newPage();
                console.log(data[0].history, "hereeeeeeeeeee");
                const htmlContent = await ejs.renderFile(templatePath, {
                    historyUsers: data,
                    translate: translate[active],
                });

                await page.setContent(htmlContent);
                await page.pdf({path: outputPath, timeout: 0, format: "A4"});
                await browser.close();

                console.log(`PDF generated successfully at: ${outputPath}`);
            }

            // Execute the aggregate query
            userHistory = await HistoryModel.find({});
            console.log(userHistory);

            templatePath = "./public/historyUsers.ejs";

            await convertEJStoPDF(templatePath, userHistory, outputPath);
            res.sendFile(__dirname + "/history.pdf");
        } catch (err) {
            console.error("Error generating PDF:", err);
            res.status(500).send("Internal Server Error");
        }
    }
});

// History User Route
app.get("/history/:id", async (req, res) => {
    try {
        const pipeline = [
            // Lookup user by ID
            {
                $match: {_id: new mongoose.mongo.ObjectId(req.params.id)},
            },
            // Project only required fields
            {
                $project: {username: 1, isAdmin: 1, creationDate: 1, updateDate: 1},
            },
            // Lookup history by userId
            {
                $lookup: {
                    from: "histories",
                    localField: "_id",
                    foreignField: "userId",
                    as: "history",
                },
            },
        ];

        const result = await UserModel.aggregate(pipeline);
        res.render("historyUser", {
            userHistory: result,
            translate: translate[active],
        });
    } catch (err) {
        console.error("Error fetching history user data:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Create User Route

// Root Route
app.get("/", async function (req, res) {
    try {
        res.render("auth", {translate: translate[active]});
    } catch (err) {
        console.error("Error reading users:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
const PORT = process.env.PORT || 5700;
app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});
