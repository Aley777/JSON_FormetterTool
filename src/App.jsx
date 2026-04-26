import { useEffect, useState } from "react";
import "./App.css";
import {
  downloadJson,
  formatJson,
  minifyJson,
  validateJson,
} from "./utils/jsonTools";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import JsonView from "@uiw/react-json-view";

const sampleJson = {
  app: "JSON Formatter Tool",
  type: "Developer Tool",
  user: {
    name: "Ahmet",
    role: "Frontend Developer",
    skills: ["React", "JavaScript", "CSS"],
    availableForHire: true,
  },
};

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [theme, setTheme] = useState("dark");
  const [toast, setToast] = useState("");
  const [parsedJson, setParsedJson] = useState(null);
  const [view, setView] = useState("code");

  const characterCount = jsonInput.length;
  const lineCount = jsonInput ? jsonInput.split("\n").length : 0;
  const isValid = jsonInput && !error && jsonOutput;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const result = formatJson(jsonInput, indent);

      setParsedJson(parsed);
      setJsonOutput(result);
      setView("code");
      setError("");
    } catch (err) {
      setParsedJson(null);
      setJsonOutput("");
      setError(err.message);
    }
  };
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const result = minifyJson(jsonInput);

      setParsedJson(parsed);
      setJsonOutput(result);
      setView("code");
      setError("");
    } catch (err) {
      setParsedJson(null);
      setJsonOutput("");
      setError(err.message);
    }
  };

  const handleValidate = () => {
    const result = validateJson(jsonInput);

    if (result.isValid) {
      setError("");
      setJsonOutput("Valid JSON ✅");
    } else {
      setJsonOutput("");
      setError(result.error);
    }
  };

  const handleLoadSample = () => {
    const sample = JSON.stringify(sampleJson);
    setJsonInput(sample);
    setJsonOutput(formatJson(sample, indent));
    setError("");
  };

  const handleCopy = async () => {
    if (!jsonOutput) {
      showToast("Nothing to copy");
      return;
    }

    await navigator.clipboard.writeText(jsonOutput);
    showToast("Copied to clipboard");
  };

  const handleDownload = () => {
    if (!jsonOutput || error) {
      showToast("No valid JSON to download");
      return;
    }

    downloadJson(jsonOutput);
    showToast("JSON downloaded");
  };

  const handleClear = () => {
    setJsonInput("");
    setJsonOutput("");
    setError("");
    setParsedJson(null);
    setView("code");
  };

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Developer Tool</p>
          <h1>JSON Formatter</h1>
          <p className="subtitle">Format, validate and minify JSON instantly.</p>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <section className="hero-card">
        <div>
          <h2>Format, validate and minify JSON instantly.</h2>
          <p>
            A recruiter-friendly React project with clean UI, utility-based
            logic, theme support and practical developer features.
          </p>
        </div>

        <div className="stats">
          <div>
            <strong>{characterCount}</strong>
            <span>Characters</span>
          </div>
          <div>
            <strong>{lineCount}</strong>
            <span>Lines</span>
          </div>
          <div>
            <strong>{indent}</strong>
            <span>Indent</span>
          </div>
        </div>
      </section>

      <section className="controls">
        <label>
          Indent
          <select value={indent} onChange={(e) => setIndent(e.target.value)}>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="8">8 spaces</option>
          </select>
        </label>

        <div className="actions">
          <button onClick={handleFormat}>Format</button>
          <button onClick={handleValidate} className="secondary">
            Validate
          </button>
          <button onClick={handleMinify} className="secondary">
            Minify
          </button>
          <button onClick={handleLoadSample} className="secondary">
            Sample
          </button>
          <button onClick={handleCopy} className="secondary">
            Copy
          </button>
          <button onClick={handleDownload} className="secondary">
            Download
          </button>
          <button onClick={handleClear} className="danger">
            Clear
          </button>
        </div>
      </section>

      <section className="status">
        <span className={isValid ? "pill success" : "pill neutral"}>
          {isValid ? "Valid JSON" : "Waiting for input"}
        </span>

        {error && <span className="pill error">Invalid JSON: {error}</span>}
      </section>

      <section className="editor-grid">
        <article className="editor-card">
          <div className="editor-header">
            <h3>Input</h3>
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
        </article>

        <article className="editor-card">
          <div className="editor-header">
            <h3>Output</h3>
            <span>Formatted result</span>
          </div>

          {jsonOutput ? (
  <SyntaxHighlighter
    language="json"
    style={theme === "dark" ? oneDark : oneLight}
    customStyle={{
      margin: 0,
      height: "500px",
      borderRadius: "0 0 24px 24px",
      background: "transparent",
    }}
  >
    {jsonOutput}
      </SyntaxHighlighter>
    ) : (
      <div className="output-body">
  {parsedJson && (
    <div className="output-tabs">
      <button
        className={view === "code" ? "active-tab" : ""}
        onClick={() => setView("code")}
      >
        Code
      </button>
      <button
        className={view === "tree" ? "active-tab" : ""}
        onClick={() => setView("tree")}
      >
        Tree
      </button>
    </div>
  )}

  {parsedJson && view === "tree" ? (
    <div className="tree-view">
      <JsonView
        value={parsedJson}
        collapsed={2}
        displayDataTypes={false}
        style={{
          background: "transparent",
          color: "var(--text)",
          fontSize: "15px",
          fontFamily: '"Fira Code", "Courier New", monospace',
        }}
      />
    </div>
  ) : jsonOutput ? (
    <SyntaxHighlighter
      language="json"
      style={theme === "dark" ? oneDark : oneLight}
      customStyle={{
        margin: 0,
        height: parsedJson ? "452px" : "500px",
        padding: "18px",
        background: "var(--editor)",
        color: "var(--text)",
        fontSize: "15px",
        lineHeight: "1.65",
        borderRadius: 0,
      }}
      wrapLongLines
    >
      {jsonOutput}
    </SyntaxHighlighter>
  ) : (
    <pre>Your formatted JSON will appear here...</pre>
  )}
</div>
    )}
        </article>
      </section>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

export default App;