import { useState, useCallback } from "react";
import "./App.css";

const URLS_LOCAL_STORAGE_KEY = "urls";
const URLS_LOCAL_STORAGE_KEY_DELIMITER = "\n";

const STOCKS_EXAMPLE_NEWLINE = "PINS\nTSLA";
const URL_EXAMPLE_NEWLINE =
  "https://stockrow.com/${symbol}\nhttps://www.wsj.com/market-data/quotes/${symbol}";
const URL_STORE_EXAMPLE_NEWLINE = `https://stockrow.com/\${symbol}
https://finviz.com/quote.ashx?ty=c&ta=1&p=d&t=\${symbol}
https://research.investors.com/ibdchartsenlarged.aspx?cht=pvc&type=DAILY&symbol=\${symbol}
https://stockcharts.com/h-sc/ui?p=D&b=5&g=0&id=p12016846985&s=\${symbol}
https://www.wsj.com/market-data/quotes/\${symbol}
https://finance.yahoo.com/quote/\${symbol}/analysis?p=\${symbol}
https://www.earningswhispers.com/stocks/\${symbol}
https://www.estimize.com/\${symbol}/fq1-2021?metric_name=revenue&chart=historical
https://stockcharts.com/freecharts/gallery.html?\${symbol}
https://fintel.io/ss/us/\${symbol}
https://finviz.com/quote.ashx?t=\${symbol}
https://www.nakedshortreport.com/company/\${symbol}
https://shortvolume.com/?t=\${symbol}
http://maximum-pain.com/options/\${symbol}
`;

const detectSplitDelimeter = (input: string) => {
  if (input.includes(" ")) {
    return " ";
  } else if (input.includes("\n")) {
    return "\n";
  } else if (input.includes(", ")) {
    return ", ";
  } else {
    return ",";
  }
};

function App() {
  const [symbolsText, setSymbolsText] = useState("");
  const [urlsText, setUrlsText] = useState("");
  const [, updateState] = useState<object>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const savedUrlTextFromStorage = (JSON.parse(
    localStorage.getItem(URLS_LOCAL_STORAGE_KEY) || "[]"
  ) as Array<string>).join(URLS_LOCAL_STORAGE_KEY_DELIMITER);
  const [savedUrlsText, setSavedUrlsText] = useState(savedUrlTextFromStorage);

  const symbolsList = symbolsText
    .split(detectSplitDelimeter(symbolsText))
    .filter((v) => v)
    .map((v) => v.trim());

  const urlsList = urlsText
    .split(detectSplitDelimeter(urlsText))
    .filter((v) => v)
    .map((v) => v.trim());

  const openTabsByTicker = () => {
    for (const symbol of symbolsList) {
      for (const url of urlsList) {
        const targetUrl = url.replace("${symbol}", symbol);
        window.open(targetUrl, "_blank");
      }
    }
  };

  const openTabsByUrl = () => {
    for (const url of urlsList) {
      for (const symbol of symbolsList) {
        const targetUrl = url.replace("${symbol}", symbol);
        window.open(targetUrl, "_blank");
      }
    }
  };

  const saveForLater = () => {
    localStorage.setItem(
      URLS_LOCAL_STORAGE_KEY,
      JSON.stringify(
        savedUrlsText
          .split(URLS_LOCAL_STORAGE_KEY_DELIMITER)
          .map((v) => v.trim()) || []
      )
    );
    forceUpdate();
  };

  return (
    <div className="App">
      <div style={{ display: "flex", marginBottom: 20, alignItems: "top" }}>
        <div className="mr20" style={{ width: 300 }}>
          <p>Symbols</p>
          <textarea
            style={{ resize: "vertical", width: "100%" }}
            value={symbolsText}
            onChange={({ target: { value } }) => setSymbolsText(value)}
            rows={10}
          ></textarea>
          {symbolsList.length >= 1 && (
            <div>Parsed: {symbolsList.join(", ")}</div>
          )}
          <div
            className="example"
            onClick={() => setSymbolsText(STOCKS_EXAMPLE_NEWLINE)}
          >
            Example
          </div>
        </div>
        <div className="mr20" style={{ width: 400 }}>
          <p>Urls</p>
          <textarea
            style={{ width: "100%", resize: "vertical" }}
            value={urlsText}
            onChange={({ target: { value } }) => setUrlsText(value)}
            rows={10}
          ></textarea>
          <div
            className="example"
            onClick={() => setUrlsText(URL_EXAMPLE_NEWLINE)}
          >
            Example
          </div>
        </div>
        <div
          style={{ display: "flex", alignContent: "center", flexDirection: "column" }}
          className="openUrlsButton"
        >
          <button
            style={{ height: 30, marginTop: 50, backgroundColor: "lightblue" }}
            onClick={openTabsByTicker}
          >
            Open Tabs (by ticker)
          </button>
          <button
            style={{ height: 30, marginTop: 50, backgroundColor: "lightblue" }}
            onClick={openTabsByUrl}
          >
            Open Tabs (by url)
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 750 }}>
        <textarea
          style={{ resize: "vertical" }}
          value={savedUrlsText}
          onChange={({ target: { value } }) => setSavedUrlsText(value)}
          rows={10}
        ></textarea>
        <div
          className="example"
          onClick={() => setSavedUrlsText(URL_STORE_EXAMPLE_NEWLINE)}
        >
          Example
        </div>
        <button
          disabled={savedUrlTextFromStorage === savedUrlsText}
          style={{ height: 30, marginTop: 20 }}
          onClick={saveForLater}
        >
          Save for later
        </button>
      </div>
    </div>
  );
}

export default App;
