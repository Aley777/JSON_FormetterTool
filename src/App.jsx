import { useState } from "react";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const pretty = JSON.stringify(parsed, null, 2);
      setFormattedJson(pretty);
      setError("");
    } catch {
      setFormattedJson("");
      setError("Invalid JSON. Please check your syntax.");
    }
  };

  const clearAll = () => {
    setJsonInput("");
    setFormattedJson("");
    setError("");
  };

  const copyOutput = async () => {
    if (!formattedJson) return;

    try {
      await navigator.clipboard.writeText(formattedJson);
      alert("Formatted JSON copied!");
    } catch {
      alert("Copy failed.");
    }
  };

  return (
    <main className="app">
      <section className="hero">
        <p className="badge">Developer Tool</p>
        <h1>JSON Formatter</h1>
        <p>
          Paste messy JSON, validate it, and instantly convert it into a clean,
          readable format.
        </p>
      </section>

      <section className="toolbar">
        <button onClick={formatJson}>Format JSON</button>
        <button className="secondary" onClick={copyOutput}>
          Copy Output
        </button>
        <button className="danger" onClick={clearAll}>
          Clear
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="editor-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Input</h2>
            <span>Paste JSON here</span>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"name":"Ahmet","skills":["React","JavaScript"]}'
          />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Formatted Output</h2>
            <span>Pretty JSON</span>
          </div>

          <pre>{formattedJson || "Formatted JSON will appear here..."}</pre>
        </div>
      </section>
    </main>
  );
}

export default App;