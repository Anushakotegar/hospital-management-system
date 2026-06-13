const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "anu$ha@07fr",
    database: "Hospitaldatab"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

app.get("/", (req, res) => {
    res.send("Hospital Management Backend Running");
});

// DISPLAY RECORDS
app.get("/patients", (req, res) => {

    db.query("SELECT * FROM Patient", (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// INSERT
app.post("/patients", (req, res) => {

    const {
        patient_id,
        name,
        age,
        gender,
        phone,
        address
    } = req.body;

    const sql = `
    INSERT INTO Patient
    (patient_id,name,age,gender,phone,address)
    VALUES (?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [patient_id,name,age,gender,phone,address],
        (err) => {

            if (err) {
                return res.status(500).send(err);
            }

            res.send("Patient Added");
        }
    );
});

// UPDATE
app.put("/patients/:id", (req,res)=>{

    db.query(
        "UPDATE Patient SET name=? WHERE patient_id=?",
        [req.body.name, req.params.id],
        (err)=>{

            if(err){
                return res.status(500).send(err);
            }

            res.send("Patient Updated");
        }
    );

});

// DELETE
app.delete("/patients/:id",(req,res)=>{

    db.query(
        "DELETE FROM Patient WHERE patient_id=?",
        [req.params.id],
        (err)=>{

            if(err){
                return res.status(500).send(err);
            }

            res.send("Patient Deleted");
        }
    );

});

// STORED PROCEDURE
app.get("/generate-bill/:id",(req,res)=>{

    db.query(
        "CALL GenerateBill(?)",
        [req.params.id],
        (err,result)=>{

            if(err){
                return res.status(500).send(err);
            }

            res.json(result);
        }
    );

});

app.listen(3000,()=>{
    console.log("🚀 Server Running On Port 3000");
});