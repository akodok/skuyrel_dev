import express from "express";
import usersRouter from "./controllers/users.ts";

const app = express();
app.use(express.json());
app.use("/users", usersRouter);

app.get("/", (_req, res) => {
  res.send("👋 Hello from Express + TypeScript 2");
});

app.use((_req, res) => {
  res.status(404).send("404 Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
