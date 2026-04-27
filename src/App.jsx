import { useEffect, useState } from "react";
import "./App.css";
import {
  downloadJson,
  formatJson,
  minifyJson,
  validateJson,
} from "./utils/jsonTools";
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
  const [isDragging, setIsDragging] = useState(false);
  const [jsonUrl, setJsonUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);

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
      setParsedJson(null);
      setView("code");
      setError("");
      setJsonOutput("Valid JSON ✅");
    } else {
      setParsedJson(null);
      setJsonOutput("");
      setError(result.error);
    }
  };

  const handleLoadSample = () => {
    const sample = JSON.stringify(sampleJson);
    setJsonInput(sample);
    setParsedJson(sampleJson);
    setJsonOutput(formatJson(sample, indent));
    setView("code");
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

  const handleFileContent = (content) => {
  try {
    const parsed = JSON.parse(content);
    const formatted = formatJson(content, indent);

    setJsonInput(content);
    setParsedJson(parsed);
    setJsonOutput(formatted);
    setView("code");
    setError("");
    showToast("JSON file loaded");
  } catch (err) {
    setParsedJson(null);
    setJsonOutput("");
    setError(err.message);
    showToast("Invalid JSON file");
  }
};

const handleFileDrop = (event) => {
  event.preventDefault();
  setIsDragging(false);

  const file = event.dataTransfer.files[0];

  if (!file) return;

  if (!file.name.endsWith(".json")) {
    showToast("Please upload a .json file");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    handleFileContent(reader.result);
  };

  reader.readAsText(file);
};

  const handleFetchJson = async () => {
    if (!jsonUrl.trim()) {
      showToast("Enter a JSON URL");
      return;
    }

    try {
      setIsFetching(true);

      const response = await fetch(jsonUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch JSON");
      }

      const data = await response.json();
      const raw = JSON.stringify(data);
      const formatted = JSON.stringify(data, null, Number(indent));

      setJsonInput(raw);
      setParsedJson(data);
      setJsonOutput(formatted);
      setView("code");
      setError("");
      showToast("JSON fetched successfully");
    } catch (err) {
      setParsedJson(null);
      setJsonOutput("");
      setError(err.message);
      showToast("Could not fetch JSON");
    } finally {
      setIsFetching(false);
    }
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

        <label className="url-field">
          JSON URL
          <div className="url-row">
            <input
              type="url"
              value={jsonUrl}
              onChange={(e) => setJsonUrl(e.target.value)}
              placeholder="https://api.example.com/data.json"
            />
            <button onClick={handleFetchJson} disabled={isFetching}>
              {isFetching ? "Fetching..." : "Fetch"}
            </button>
          </div>
        </label>

        <div className="actions">
          <button onClick={handleFormat} disabled={!jsonInput.trim()}>
            Format
          </button>

          <button
            onClick={handleValidate}
            className="secondary"
            disabled={!jsonInput.trim()}
          >
            Validate
          </button>

          <button
            onClick={handleMinify}
            className="secondary"
            disabled={!jsonInput.trim()}
          >
            Minify
          </button>

          <button onClick={handleLoadSample} className="secondary">
            Sample
          </button>

          <button
            onClick={handleCopy}
            className="secondary"
            disabled={!jsonOutput}
          >
            Copy
          </button>

          <button
            onClick={handleDownload}
            className="secondary"
            disabled={!jsonOutput || !!error}
          >
            Download
          </button>

          <button
            onClick={handleClear}
            className="danger"
            disabled={!jsonInput && !jsonOutput}
          >
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
        <article
  className={`editor-card ${isDragging ? "dragging" : ""}`}
  onDragOver={(event) => {
    event.preventDefault();
    setIsDragging(true);
  }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={handleFileDrop}
>
  <div className="editor-header">
    <h3>Input</h3>
    <span>Paste or drop .json file</span>
  </div>

  <textarea
  value={jsonInput}
  onChange={(e) => {
    setJsonInput(e.target.value);
    setError("");
  }}
  onPaste={(e) => {
    const pasted = e.clipboardData.getData("text");

    try {
      const parsed = JSON.parse(pasted);
      const formatted = formatJson(pasted, indent);

      setJsonInput(pasted);
      setParsedJson(parsed);
      setJsonOutput(formatted);
      setView("code");
      setError("");

      showToast("JSON auto-formatted");
      e.preventDefault(); // 🔥 önemli
    } catch {
      // JSON değilse normal yapıştırma
    }
  }}
  placeholder='Paste JSON here or drag & drop a .json file...'
/>

  {isDragging && (
    <div className="drag-overlay">
      <p>Drop your JSON file here</p>
    </div>
  )}
</article>

        <article className="editor-card">
  <div className="editor-header">
    <h3>Output</h3>
    <span>Formatted result</span>
  </div>

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
) : (
  <pre className={parsedJson ? "code-output with-tabs" : "code-output"}>
    <code>{jsonOutput || "Your formatted JSON will appear here..."}</code>
  </pre>
)}
  </div>
</article>
      </section>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

export default App;