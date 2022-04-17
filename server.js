const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const ejs = require("ejs");

mongoose.connect(
  "mongodb+srv://MiniProject:AXyWWjP0bNM3GgiA@cluster0.6q1rk.mongodb.net/doctorDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const docSchema = {
  docId:String,
  name: String,
  specialisation: String,
  gender: String,
};

const patSchema = {
  patId:String,
  name: String,
  age: String,
  gender: String,
};

const appSchema = {
  patientId: String,
  doctorId: String,
  appointmentNo:String,
  appointmentDate:Date
};

const doctor = mongoose.model("Doctor", docSchema);
const patient = mongoose.model("Patient", patSchema);
const appointment = mongoose.model("Appointment", appSchema);

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.render("index");
});



app.post("/doctor", (req, res) => {
  doctor.find({}, function(err, drs){
    if(!err){
      let newDoctor = new doctor({
        docId:'DOC'+(drs.length+1).toString().padStart(3,'0'),
        name: req.body.name,
        specialisation: req.body.specialisation,
        gender: req.body.gender,
      });
      newDoctor.save();
      res.redirect("/doctor");
    }
  });
});

app.get("/doctor", (req, res) => {
  doctor.find({}, (err, drs) => {
    res.render("doctor", {
      drList: drs,
    });
  });
  
});

app.get("/patient", (req, res) => {
  patient.find({}, (err, pts) => {
    res.render("patient", {
      ptList: pts,
    });
  });
});

app.post("/patient", (req, res) => {
  patient.find({}, function(err, pts){
    let newPatient = new patient({
      patId:'PAT'+(pts.length+1).toString().padStart(4,'0'),
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
    });
    newPatient.save();
    res.redirect("/patient");
  });
  
});

app.get("/appointment", (req, res) => {
  appointment.find({}, (err, app) => {
    res.render("appointment", {
      apList: app,
    });
  });
});

app.post("/appointment", (req, res) => {
  appointment.find({}, function(err, app){
    patient.find({name:req.body.ptname},function(err,pt){
      if(pt.length>0){
        doctor.find({name:req.body.drname}, function(err, drs){
          if(drs.length>0){
            console.log(drs);
            console.log(pt[0]);
            let newAppointment = new appointment({
              patientId: pt[0].patId,
              doctorId: drs[0].docId,
              appointmentNo: 'APP'+(app.length+1).toString().padStart(4,'0'),
              appointmentDate:req.body.date
            });
            newAppointment.save();
            res.redirect("/appointment");
          }
          else{
            console.log('no doctor found');
            res.redirect("/doctor");
          }
        })
      }
      else{
        console.log('no patient found');
        res.redirect('/patient')
      }
    })
  });
});

app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});

