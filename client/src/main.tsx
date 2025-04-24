import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import dotenv from "dotenv";
dotenv.config();

const root = document.getElementById("root");

if (!root) {
  throw new Error("No root element found");
}

createRoot(root).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
