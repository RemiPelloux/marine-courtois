import "@testing-library/jest-dom/vitest";

// jsdom lacks these browser APIs used by motion and the visualizations
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    }),
  });
}
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (!("IntersectionObserver" in window)) {
  Object.defineProperty(window, "IntersectionObserver", { writable: true, value: IntersectionObserverStub });
}
