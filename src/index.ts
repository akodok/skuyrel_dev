import express from "express";
import usersRouter from "./controllers/users.ts";
import loginRouter from "./controllers/login.ts";
import sessionRouter from "./controllers/session.ts";
import modulesRouter from "./controllers/modules.ts";
import vehiculesRouter from "./controllers/vehicules.ts";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5173"
    ],
    credentials: true
  })
);
app.use(express.json());
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/session", sessionRouter);
app.use("/modules", modulesRouter);
app.use("/vehicules", vehiculesRouter);

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
function cors(arg0: { origin: string[]; credentials: boolean; }): any {
  throw new Error("Function not implemented.");
}

