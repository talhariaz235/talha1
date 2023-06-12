const express = require("express")
const server = express()
const mongoose = require("mongoose")
var cookieParser = require("cookie-parser");
var expressLayouts = require("express-ejs-layouts");

const multer = require("multer")
const path = require("path")
var Car = require('./Model/car')
let checkSessionAuth = require("./middlewares/checkSessionAuth");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    }, filename: (req, file, cb) => {
        console.log(file)
        var temp=Date.now() + path.extname(file.originalname)
        cb(null,temp )
        req.body={...req.body,carImage:temp}

    }

})

const upload = multer({ storage })
var session = require("express-session");
//view engine setting 
server.set("view engine", "ejs");
// for body parse
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
    session({
      secret: "have your own code plz",
      cookie: { maxAge: 600000 },
      resave: true,
      saveUninitialized: true,
    })
  );
// server.use(expressLayouts);
server.use(cookieParser());
// browsers folder static
server.use(express.static("public"));

server.use(expressLayouts);
server.use(require("./middlewares/siteSettings"));

server.get("/", (req, res, next) => {
    res.render(`home`);
})

server.get("/info.ejs",checkSessionAuth, async(req, res, next) => {
    const car = await Car.find()
    console.log("Data",car)
    res.render(`info`,{car});
})

server.get("/booking.ejs",checkSessionAuth, (req, res, next) => {
    res.render(`booking`);
})

server.get("/contact.ejs", (req, res, next) => {
    res.render(`contact`);
})
server.get("/addcar.ejs", checkSessionAuth,(req, res, next) => {
    res.render(`addcar`);
})
server.get("/login.ejs", (req, res, next) => {
    res.render(`login`);
})
server.get("/sign_up.ejs", (req, res, next) => {
    res.render(`sign_up`);
})

server.post("/submitCar", upload.single('image'),async(req,res,next)=>{
    console.log("Body",req.body)
    const car = new Car(req.body)
    await car.save()
    res.redirect("/info.ejs")

})
server.get("/delete:id",checkSessionAuth,  async(req, res, next) => {
    console.log("IDD",req.params.id)
    let students = await Car.findByIdAndDelete({_id:(req.params.id).split(":")[1]});
    console.log("Students deleted",students);
    res.redirect('/info.ejs')
  });
  server.get("/edit:id",checkSessionAuth,  async(req, res, next) => {
    console.log("IDD",req.params.id)
    let students = await Car.find({_id:(req.params.id).split(":")[1]});
    console.log("Students find",students)
    res.render("edit",{data:students[0]});
  });
  server.get("/view:id",checkSessionAuth,  async(req, res, next) => {
    console.log("IDD",req.params.id)
    let students = await Car.find({_id:(req.params.id).split(":")[1]});
    console.log("Students find",students)
    res.render("detail",{car:students[0]});
  });

  server.post("/update",checkSessionAuth, upload.single('image'), async(req, res, next) => {
    console.log("body in update",req.body)
    let students = await Car.find({companyName:req.body.companyName});
    let stude = await Car.updateOne({_id:students[0]._id},req.body);
    // console.log("Students find in original",students)
    // console.log("Students find in update",stude)
    res.redirect('/info.ejs')
  });
server.use("/api/auth", require("./routes/auth"));

const port = 5000
server.listen(port, () => {
    console.log(`server is runing at ${port}`)
})




const mongourl = "mongodb+srv://talhariaz:talha123@cluster0.johbjvl.mongodb.net/"
mongoose
    .connect(mongourl, { useNewUrlParser: true })
    .then(() => console.log("Connected to Mongo ...."))
    .catch((error) => console.log(error.message));