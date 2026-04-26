export function formatJson(input, indent = 2) {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, Number(indent));
}

export function minifyJson(input) {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function validateJson(input) {
  try {
    JSON.parse(input);
    return {
      isValid: true,
      error: "",
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
    };
  }
}

export function downloadJson(content, fileName = "formatted.json") {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}