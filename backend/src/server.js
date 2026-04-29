import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Initial Server for EzQurbani");
}); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});