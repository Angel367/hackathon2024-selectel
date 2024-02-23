import "./App.css";
import ReactDOM from "react-dom/client";
import React, { useEffect } from "react";
const tg = window.Telegram.WebApp;
function App() {
  useEffect(() => {
    tg.ready();
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      tg.close();
    });
  }, []);
  const onClose = () => {
    tg.close();
  };
  return (
    <div>
      <h1>Work</h1>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
