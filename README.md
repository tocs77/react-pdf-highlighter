# PdfHighlighterEmbed Component

This component is used to embed a PDF highlighter into a React application. It allows users to highlight and comment on text or areas within a PDF document.

## Props

- `className`: Optional CSS class name to apply to the component.
- `style`: Optional inline styles to apply to the component.
- `highlights`: An array of existing highlights to display on the PDF.
- `url`: The URL of the PDF document to load.
- `beforeLoad`: Optional content to display while the PDF is loading.
- `onScrollChange`: A callback function to be called when the scroll position changes.
- `addHighlight`: A function to add a new highlight to the PDF.
- `scrollRef`: A mutable ref object to store the scroll function.

## Usage

```jsx
import { PdfHighlighterEmbed } from "./PdfHighlighterEmbed";

// Define your highlights
const highlights = [
  {
    content: {
      text: "This is a highlighted text",
      image: null,
    },
    position: {
      x1: 100,
      y1: 200,
      x2: 300,
      y2: 400,
    },
    color: "orange",
    comment: "New highlight",
    created: new Date().toLocaleDateString(),
    author: "Иванов И.И.",
  },
  // Add more highlights as needed
];

// Define your scroll function
const scrollRef = React.useRef(null);

// Define your addHighlight function
const addHighlight = (highlight) => {
  // Handle adding the highlight to your state or data store
};

// Render the component
<PdfHighlighterEmbed
  className="pdf-highlighter"
  style={{ width: "100%", height: "500px" }}
  highlights={highlights}
  url="path/to/your/pdf.pdf"
  onScrollChange={() => console.log("Scroll changed")}
  addHighlight={addHighlight}
  scrollRef={scrollRef}
/>;
```

## Dependencies

This component depends on the following components:

- `PdfLoader`: A component to load and display a PDF document.
- `PdfHighlighter`: A component to highlight areas within a PDF document.
- `AreaHighlight`: A component to display an area highlight.
- `Highlight`: A component to display a text highlight.
- `Popup`: A component to display a popup with additional information.

## HighlightPopup Component

This is a sub-component used to display a popup with highlight information. It takes the following props:

- `comment`: The comment associated with the highlight.
- `created`: The date when the highlight was created.
- `author`: The author of the highlight.

The popup will only be displayed if the `comment` prop is provided.
