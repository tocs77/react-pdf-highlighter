import React, { MutableRefObject } from "react";

import type { IHighlight, NewHighlight, ViewportHighlight } from "../types";
import PdfLoader from "./PdfLoader";

import { PdfHighlighter } from "./PdfHighlighter";
import { AreaHighlight } from "./AreaHighlight";
import { Highlight } from "./Highlight";
import Popup from "./Popup";

interface PdfHighlighterEmbedProps<T_HT> {
  readonly?: boolean;
  onClickHighlight: (highlight: ViewportHighlight) => void;
  className?: string;
  style?: React.CSSProperties;
  highlights: Array<IHighlight>;
  url: string;
  beforeLoad?: JSX.Element;
  onScrollChange: () => void;
  addHighlight: (highlight: NewHighlight) => void;
  scrollRef: MutableRefObject<(highlight: T_HT) => void>;
}

export const PdfHighlighterEmbed = <T_HT extends IHighlight>(
  props: PdfHighlighterEmbedProps<T_HT>
) => {
  const {
    className,
    url,
    highlights,
    beforeLoad,
    onScrollChange,
    addHighlight,
    scrollRef,
    style,
    readonly = false,
    onClickHighlight,
  } = props;
  return (
    <div className={className} style={style}>
      <PdfLoader url={url} beforeLoad={beforeLoad || <div>Загрузка...</div>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event) => event.altKey}
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
                />
              ) : (
                <AreaHighlight
                  isScrolledTo={isScrolledTo}
                  highlight={highlight}
                  onClick={() => onClickHighlight(highlight)}
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
