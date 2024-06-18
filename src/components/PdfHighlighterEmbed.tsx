import React, { MutableRefObject, useEffect, useMemo, useState } from "react";

import type { IHighlight, NewHighlight, ViewportHighlight } from "../types";
import PdfLoader from "./PdfLoader";

import { PdfHighlighter } from "./PdfHighlighter";
import { AreaHighlight } from "./AreaHighlight";
import { Highlight } from "./Highlight";
import Popup from "./Popup";

let workerLoaded = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsWorker: any;
// (async () => {
//   pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
//   console.log("loaded worker");
//   workerLoaded = true;
// })();

interface PdfHighlighterEmbedProps<T_HT> {
  readonly?: boolean;
  onClickHighlight: (highlight: ViewportHighlight) => void;
  className?: string;
  scaleRef: MutableRefObject<(scale: number) => void>;
  style?: React.CSSProperties;
  highlights: Array<IHighlight>;
  url: string;
  defaultScale?: number;
  beforeLoad?: JSX.Element;
  onScrollChange: () => void;
  addHighlight: (highlight: NewHighlight) => void;
  scrollRef: MutableRefObject<(highlight: T_HT) => void>;
  enableAreaSelection: (e: MouseEvent) => boolean;
  scrolledStyle?: React.CSSProperties;
}

export const PdfHighlighterEmbed = <T_HT extends IHighlight>(
  props: PdfHighlighterEmbedProps<T_HT>
) => {
  const {
    className,
    url,
    scaleRef,
    highlights,
    beforeLoad,
    onScrollChange,
    addHighlight,
    scrollRef,
    style,
    readonly = false,
    onClickHighlight,
    enableAreaSelection,
    defaultScale,
    scrolledStyle,
  } = props;

  const [workerImported, setWorkerImported] = useState(false);

  const importWorker = async () => {
    pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
    if (pdfjsWorker) {
      setWorkerImported(true);
    }
  };

  useEffect(() => {
    if (!workerImported || !pdfjsWorker) {
      importWorker();
    }
  }, [workerLoaded]);

  const loader = useMemo(() => {
    if (!workerImported) return <div>Подготовка</div>;
    return (
      <PdfLoader
        url={url}
        beforeLoad={beforeLoad || <div>Загрузка...</div>}
        workerSrc={pdfjsWorker}
      >
        {(pdfDocument) => (
          <PdfHighlighter
            scaleRef={(scale) => {
              scaleRef.current = scale;
            }}
            pdfScaleValue={defaultScale || 100}
            pdfDocument={pdfDocument}
            enableAreaSelection={enableAreaSelection}
            readonly={readonly}
            onScrollChange={onScrollChange}
            scrollRef={(scrollTo) => {
              scrollRef.current = scrollTo;
            }}
            onSelectionFinished={(
              position,
              content,
              hideTipAndSelection,
              transformSelection
            ) => {
              addHighlight({
                content,
                position,
                color: "orange",
                comment: "New highlight",
                created: new Date().toISOString(),
                author: "Иванов И.И.",
              });
              hideTipAndSelection();
              return null;
            }}
            highlightTransform={(
              highlight,
              index,
              setTip,
              hideTip,
              viewportToScaled,
              screenshot,
              isScrolledTo
            ) => {
              const isTextHighlight = !Boolean(
                highlight.content && highlight.content.image
              );

              const component = isTextHighlight ? (
                <Highlight
                  isScrolledTo={isScrolledTo}
                  position={highlight.position}
                  comment={highlight.comment}
                  color={highlight.color}
                  onClick={() => onClickHighlight(highlight)}
                  scrolledStyle={scrolledStyle}
                />
              ) : (
                <AreaHighlight
                  isScrolledTo={isScrolledTo}
                  highlight={highlight}
                  onClick={() => onClickHighlight(highlight)}
                  scrolledStyle={scrolledStyle}
                />
              );

              return (
                <Popup
                  popupContent={<HighlightPopup {...highlight} />}
                  onMouseOver={(popupContent) =>
                    setTip(highlight, (highlight) => popupContent)
                  }
                  onMouseOut={hideTip}
                  key={index}
                  children={component}
                />
              );
            }}
            highlights={highlights}
          />
        )}
      </PdfLoader>
    );
  }, [addHighlight, highlights, url, workerImported, enableAreaSelection]);

  return (
    <div className={className} style={style}>
      {loader}
    </div>
  );
};

const HighlightPopup = ({
  comment,
  created,
  author,
}: {
  comment: string;
  created: string;
  author: string;
}) =>
  comment ? (
    <div className="Highlight__popup">
      <div>{comment}</div>
      <div>{author}</div>
      <div>{created}</div>
    </div>
  ) : null;
