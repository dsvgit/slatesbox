import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import "./normalize.css";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
export {updateHash} from "slate-extended/transforms/updateHash";
export {foldElement} from "slate-extended/transforms/foldElement";
