# PdfHighlighterEmbed Component

This component is used to embed a PDF highlighter into a React application. It allows users to highlight text and areas in a PDF document, and also provides a way to add new highlights and handle scroll changes.

## Props

- `readonly`: A boolean indicating whether the highlighter is in read-only mode.
- `onClickHighlight`: A function that is called when a highlight is clicked.
- `className`: A CSS class name to apply to the component.
- `style`: Inline styles to apply to the component.
- `highlights`: An array of existing highlights to display.
- `url`: The URL of the PDF document to load.
- `beforeLoad`: A JSX element to display while the PDF is loading.
- `onScrollChange`: A function that is called when the scroll position changes.
- `addHighlight`: A function that adds a new highlight.
- `scrollRef`: A mutable ref object that is used to scroll to a specific highlight.
- `scaleRef`: A mutable ref object that is used to scale pdf.

- `enableAreaSelection`: Function to check if area selection anbled

## Usage

```jsx
import { PdfHighlighterEmbed } from "@tdms/pdf-highlight-embed";

// ...

<PdfHighlighterEmbed
  url="path/to/your/pdf.pdf"
  highlights={highlights}
  scaleRef={scaleRef}
  defaultScale={100}
  onClickHighlight={handleClickHighlight}
  addHighlight={handleAddHighlight}
  scrollRef={scrollRef}
  onScrollChange={handleScrollChange}
  readonly={false}
  enableAreaSelection={(e) => e.altKey}
/>;
```

## Dependencies

This component depends on the following components and types:

- `PdfLoader`
- `PdfHighlighter`
- `AreaHighlight`
- `Highlight`
- `Popup`
- `IHighlight`
- `NewHighlight`
- `ViewportHighlight`

Make sure to import these dependencies in your file.

## Notes

- The `HighlightPopup` component is used to display additional information when a highlight is hovered over.
- The `PdfHighlighterEmbed` component uses the `PdfLoader` to load the PDF document and then renders the `PdfHighlighter` component with the loaded document.
- The `PdfHighlighter` component handles the actual highlighting and selection of text and areas.
- The `onSelectionFinished` prop of the `PdfHighlighter` component is used to add a new highlight when the user finishes selecting text or an area.
- The `highlightTransform` prop of the `PdfHighlighter` component is used to transform the highlights into components that can be displayed in the UI.
- The `scrollRef` prop is used to provide a way for the parent component to scroll to a specific highlight.
