import React from "react";
import App from "./App";
import AppNew from "./AppNew";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<AppNew />);
