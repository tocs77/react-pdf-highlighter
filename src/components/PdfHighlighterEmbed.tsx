import React, { MutableRefObject } from "react";

import type { IHighlight, NewHighlight } from "../types";
import PdfLoader from "./PdfLoader";

import { PdfHighlighter } from "./PdfHighlighter";
import { AreaHighlight } from "./AreaHighlight";
import { Highlight } from "./Highlight";
import Tip from "./Tip";
import Popup from "./Popup";

interface PdfHighlighterEmbedProps<T_HT> {
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
  } = props;
  return (
    <div className={className} style={style}>
      <PdfLoader url={url} beforeLoad={beforeLoad || <div>Загрузка...</div>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event) => event.altKey}
            onScrollChange={onScrollChange}
            scrollRef={(scrollTo) => {
              scrollRef.current = scrollTo;
            }}
            onSelectionFinished={(
              position,
              content,
              hideTipAndSelection,
              transformSelection
            ) => (
              <Tip
                onOpen={transformSelection}
                onConfirm={(comment) => {
                  addHighlight({ content, position, comment });

                  hideTipAndSelection();
                }}
              />
            )}
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
                />
              ) : (
                <AreaHighlight
                  isScrolledTo={isScrolledTo}
                  highlight={highlight}
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
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;
