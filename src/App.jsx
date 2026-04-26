import { useState } from "react";
import "./App.css";

const sampleJson = {
  user: {
    name: "Ahmet",
    role: "Frontend Developer",
    skills: ["React", "JavaScript", "CSS"],
    active: true,
  },
  projects: [
    {
      name: "JSON Formatter",
      type: "Developer Tool",
    },
  ],
};

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const pretty = JSON.stringify(parsed, null, Number(indent));
      setFormattedJson(pretty);
      setError("");
    } catch {
      setFormattedJson("");
      setError("Invalid JSON. Please check your syntax.");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setFormattedJson(minified);
      setError("");
    } catch {
      setFormattedJson("");
      setError("Invalid JSON. Please check your syntax.");
    }
  };

  const loadSample = () => {
    const sample = JSON.stringify(sampleJson);
    setJsonInput(sample);
    setFormattedJson(JSON.stringify(sampleJson, null, Number(indent)));
    setError("");
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

  const isValid = jsonInput && !error && formattedJson;

  return (
    <main className="app">
      <section className="hero">
        <p className="badge">Developer Tool</p>
        <h1>JSON Formatter</h1>
        <p>
          Paste messy JSON, validate it, format it, minify it, and copy clean
          output instantly.
        </p>
      </section>

      <section className="controls">
        <div className="select-group">
          <label htmlFor="indent">Indent size</label>
          <select
            id="indent"
            value={indent}
            onChange={(e) => setIndent(e.target.value)}
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="8">8 spaces</option>
          </select>
        </div>

        <div className="toolbar">
          <button onClick={formatJson}>Format JSON</button>
          <button className="secondary" onClick={minifyJson}>
            Minify
          </button>
          <button className="secondary" onClick={loadSample}>
            Load Sample
          </button>
          <button className="secondary" onClick={copyOutput}>
            Copy Output
          </button>
          <button className="danger" onClick={clearAll}>
            Clear
          </button>
        </div>
      </section>

      <section className="status-row">
        <span className={isValid ? "status valid" : "status idle"}>
          {isValid ? "Valid JSON" : "Waiting for JSON"}
        </span>

        <span>{jsonInput.length} characters</span>
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
            onChange={(e) => {
              setJsonInput(e.target.value);
              setError("");
            }}
            placeholder='{"name":"Ahmet","skills":["React","JavaScript"]}'
          />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Output</h2>
            <span>Formatted / Minified JSON</span>
          </div>

          <pre>{formattedJson || "Formatted JSON will appear here..."}</pre>
        </div>
      </section>
    </main>
  );
}

export default App;