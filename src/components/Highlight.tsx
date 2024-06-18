import React, { Component } from "react";

import "../style/Highlight.css";

import type { LTWHP } from "../types.js";

interface Props {
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  comment: string;
  isScrolledTo: boolean;
  color?: string;
  scrolledStyle?: React.CSSProperties;
}

export class Highlight extends Component<Props> {
  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      isScrolledTo,
      scrolledStyle,
      color = "#ffe28f",
    } = this.props;

    const { rects } = position;
    const scrollStyles = isScrolledTo ? scrolledStyle : {};

    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        <div className="Highlight__parts">
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={{
                ...rect,
                backgroundColor: color,
                ...scrollStyles,
              }}
              className={"Highlight__part"}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
