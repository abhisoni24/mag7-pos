import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const root = document.getElementById("root");

if (!root) {
  throw new Error("No root element found");
}

createRoot(root).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
