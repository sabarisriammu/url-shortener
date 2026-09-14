const express=require("express");
const cors=require("cors");
require("dotenv").config();
const connectDB=require("./config/db");
const urlRoutes=require("./routes/urlRoutes");
const { redirectToOriginalUrl } = require("./controllers/urlController");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const app=express();
connectDB();
app.use(cors());
app.use(express.json());
app.get("/:shortCode", redirectToOriginalUrl);
app.use("/api/urls", urlRoutes);
app.use("/api/auth", authRoutes);
app.get("/",(req,res)=>{
    res.json({
        message: "URL Shortener API is running"
    });
});
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
});
app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});