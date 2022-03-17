import React from "react";

import initialValue from "initialValue";
import SlateEditor from "components/SlateEditor";

const App = () => {
  return (
    <main className="app">
      <SlateEditor initialValue={initialValue} />
    </main>
  );
};

export default App;
