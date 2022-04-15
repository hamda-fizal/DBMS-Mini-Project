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
  name: String,
  specialisation: String,
  gender: String,
};

const patSchema = {
  name: String,
  age: String,
  gender: String,
};

const appSchema = {
  patient: String,
  doctor: String,
  specialisation: String,
};

const doctor = mongoose.model("Doctor", docSchema);
const patient = mongoose.model("Patient", patSchema);
const appointment = mongoose.model("Appointment", appSchema);

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});



app.post("/doctor", (req, res) => {
  let newDoctor = new doctor({
    name: req.body.name,
    specialisation: req.body.specialisation,
    gender: req.body.gender,
  });
  newDoctor.save();
  res.redirect("/doctor");
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
  let newPatient = new patient({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
  });
  newPatient.save();
  res.redirect("/patient");
});

app.get("/appointment", (req, res) => {
  appointment.find({}, (err, app) => {
    res.render("appointment", {
      apList: app,
    });
  });
});

app.post("/appointment", (req, res) => {
  let newAppointment = new appointment({
    patient: req.body.ptname,
    doctor: req.body.drname,
    specialisation: req.body.specialisation,
  });
  newAppointment.save();
  res.redirect("/appointment");
});

app.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
});
