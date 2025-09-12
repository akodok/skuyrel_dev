import express from "express";
import usersRouter from "./controllers/users.ts";
import loginRouter from "./controllers/login.ts";
import sessionRouter from "./controllers/session.ts";
import adminRouter from "./controllers/admin.ts";

const app = express();
app.use(express.json());
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/session", sessionRouter);
app.use("/admin", adminRouter);

app.get("/", (_req, res) => {
  res.send("👋 Hello from Express + TypeScript");
});

app.use((_req, res) => {
  res.status(404).send("404 Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
