
import express from "express";
import "dotenv/config"
import { connectDB } from "./lib/db.js";
import User from "./models/user.model.js"
import { clerkMiddleware } from '@clerk/express'
import cors from "cors"
import fs from "fs";
import path from "path";
import job from "./lib/cron.js";
import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"

const app = express()
const PORT=process.env.PORT
const FRONTEND_URL=process.env.FRONTEND_URL

const publicDIR = path.join(process.cwd(), "public");

app.use("/api/webhooks/clerk", express.raw({type:"application/json"}) ,clerkWebhook)

app.use(express.json())
app.use(clerkMiddleware())
app.use(cors({origin:FRONTEND_URL, credentials: true}))


app.get("/health", (req,res)=> {
    res.status(200).json({ok:true})
})

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)



// If the public directory exists, serve the static files.
// This is for production build
if (fs.existsSync(publicDIR)) {
    app.use(express.static(publicDIR))

    app.get("/{*any}", (req, res, next)=> {
        res.sendFile(path.join(publicDIR, "index.html"), (err) => next(err));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("server is running on PORT:", PORT);

    if (process.env.NODE_ENV ==="production") {
        job.start();
    }
});