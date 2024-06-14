import React, { useEffect, useRef, useState } from "react";

import { PdfHighlighterEmbed } from "./react-pdf-highlighter";

import type {
  IHighlight,
  NewHighlight,
  ViewportHighlight,
} from "./react-pdf-highlighter";

import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "./Spinner";
import { Sidebar } from "./Sidebar";

import "./style/App.css";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
// const PRIMARY_PDF_URL =
// "https://www.rlocman.ru/i/File/2023/03/09/ASMT-Jx3x.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
const initialHighlights = testHighlights[initialUrl]
  ? [...testHighlights[initialUrl]]
  : [];

const App = () => {
  const [url, setUrl] = useState(initialUrl);
  const [highlights, setHighlights] = useState(initialHighlights);
  const highlightsRef = useRef(initialHighlights);
  const [scale, setScale] = useState(100);

  const scrollViewerTo = useRef<(highlight: any) => void>(
    (highlight: any) => {}
  );

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    setUrl(newUrl);
    setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : []);
  };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      scrollViewerTo.current?.(highlight);
    }
  };

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
  }, []);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    const newHighlights = [
      { ...highlight, id: getNextId() },
      ...highlightsRef.current,
    ];
    highlightsRef.current = newHighlights;
    setHighlights(newHighlights);
  };

  const clickHighlightHandler = (highlight: ViewportHighlight) => {
    console.log("clickHighlightHandler", highlight);
  };

  const updateScale = (val: number) => {
    const newScale = scale + val;
    if (newScale < 20 || newScale > 500) return;
    setScale(newScale);
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
      />
      <div className="container">
        <div style={{ width: "300px" }}>
          <button onClick={() => updateScale(10)}>+</button>
          <button onClick={() => updateScale(-10)}>-</button>
        </div>

        <PdfHighlighterEmbed
          enableAreaSelection={(e) => e.altKey}
          pdfScaleValue={scale}
          onClickHighlight={clickHighlightHandler}
          addHighlight={addHighlight}
          readonly={false}
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative",
          }}
          scrollRef={scrollViewerTo}
          highlights={highlights}
          url={url}
          beforeLoad={<Spinner />}
          onScrollChange={resetHash}
        />
      </div>
    </div>
  );
};

export default App;
