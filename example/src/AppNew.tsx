import React, { useEffect, useRef, useState } from "react";

import { PdfHighlighterEmbed } from "./react-pdf-highlighter";

import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";

import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "./Spinner";
import { Sidebar } from "./Sidebar";

import "./style/App.css";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
}

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

const AppNew = () => {
  const [state, setState] = useState<State>({
    url: initialUrl,
    highlights: testHighlights[initialUrl]
      ? [...testHighlights[initialUrl]]
      : [],
  });

  const scrollViewerTo = useRef<(highlight: any) => void>(
    (highlight: any) => {}
  );

  const resetHighlights = () => {
    setState({
      url: state.url,
      highlights: [],
    });
  };

  const toggleDocument = () => {
    const newUrl =
      state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
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
    const { highlights } = state;

    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    const { highlights } = state;

    console.log("Saving highlight", highlight);

    setState({
      url: state.url,
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
    });
  };

  const { url, highlights } = state;

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
      />
      <PdfHighlighterEmbed
        addHighlight={addHighlight}
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
  );
};

export default AppNew;
