import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const root = document.getElementById("root");

if (!root) {
  throw new Error("No root element found");
}

/**
 * @function Main
 * @description This is the entry point of the React application.
 * It renders the App component wrapped in a ThemeProvider.
 * @returns {void}
 */
createRoot(root).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
