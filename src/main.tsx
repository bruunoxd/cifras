import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./pages/App";
import Musicas from "./pages/Musicas";
import Favoritos from "./pages/Favoritos";
import Historico from "./pages/Historico";
import Offline from "./pages/Offline";
import Listas from "./pages/Listas";
import Buscar from "./pages/Buscar";
import Importar from "./pages/Importar";
import Backup from "./pages/Backup";
import Ajuda from "./pages/Ajuda";
import Assinatura from "./pages/Assinatura";
import Login from "./pages/Login";
import Preferencias from "./pages/Preferencias";
import Sociais from "./pages/Sociais";

// Componente simples para página sobre
const Sobre = () => (
  <div style={{ padding: "2rem" }}>
    <h2>Sobre</h2>
    <p>CifrasNew — aplicativo para organizar e tocar suas cifras.</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Musicas /> },
      { path: "musicas", element: <Musicas /> },
      { path: "favoritos", element: <Favoritos /> },
      { path: "historico", element: <Historico /> },
      { path: "offline", element: <Offline /> },
      { path: "listas", element: <Listas /> },
      { path: "buscar", element: <Buscar /> },
      { path: "importar", element: <Importar /> },
      { path: "backup", element: <Backup /> },
      { path: "preferencias", element: <Preferencias /> },
      { path: "sociais", element: <Sociais /> },
      { path: "ajuda", element: <Ajuda /> },
      { path: "sobre", element: <Sobre /> },
      { path: "assinatura", element: <Assinatura /> },
      { path: "login", element: <Login /> },
    ],
  },
]);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<RouterProvider router={router} />);
}
