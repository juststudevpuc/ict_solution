import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { persitor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

// We use createRoot() directly because we imported it directly above!
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persitor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
