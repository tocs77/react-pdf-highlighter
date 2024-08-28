import { Page } from '../types';

export const getDocument = (elm: any): Document => (elm || {}).ownerDocument || document;
export const getWindow = (elm: any): typeof window => (getDocument(elm) || {}).defaultView || window;
export const isHTMLElement = (elm: any) => elm instanceof HTMLElement || elm instanceof getWindow(elm).HTMLElement;
export const isHTMLCanvasElement = (elm: any) =>
  elm instanceof HTMLCanvasElement || elm instanceof getWindow(elm).HTMLCanvasElement;

export const asElement = (x: any): HTMLElement => x;

export const getPageFromElement = (target: HTMLElement): Page | null => {
  const node = asElement(target.closest('.page'));

  if (!isHTMLElement(node)) {
    return null;
  }

  const number = Number(node.dataset.pageNumber);

  return { node, number } as Page;
};

export const getPagesFromRange = (range: Range): Page[] => {
  const startParentElement = range.startContainer.parentElement;
  const endParentElement = range.endContainer.parentElement;

  if (!isHTMLElement(startParentElement) || !isHTMLElement(endParentElement)) {
    return [];
  }

  const startPage = getPageFromElement(startParentElement);
  const endPage = getPageFromElement(endParentElement);

  if (!startPage?.number || !endPage?.number) {
    return [];
  }

  if (startPage.number === endPage.number) {
    return [startPage];
  }

  if (startPage.number === endPage.number - 1) {
    return [startPage, endPage];
  }

  const pages: Page[] = [];

  let currentPageNumber = startPage.number;

  const document = startPage.node.ownerDocument;

  while (currentPageNumber <= endPage.number) {
    const currentPage = getPageFromElement(document.querySelector(`[data-page-number='${currentPageNumber}'`) as HTMLElement);
    if (currentPage) {
      pages.push(currentPage);
    }
    currentPageNumber++;
  }

  return pages;
};

export const findOrCreateContainerLayer = (container: HTMLElement, className: string) => {
  const doc = getDocument(container);
  let layer = container.querySelector(`.${className}`);

  if (!layer) {
    layer = doc.createElement('div');
    layer.className = className;
    container.appendChild(layer);
  }

  return layer;
};
