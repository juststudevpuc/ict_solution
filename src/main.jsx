import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { persitor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

// ✅ The import with curly braces
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persitor}>
        {/* Wrapping the App inside the ThemeProvider */}
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);