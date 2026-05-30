// Manual mock for framer-motion, applied automatically to every test (it sits
// in <rootDir>/__mocks__ for a node_modules package).
//
// heroui's animated components (Button ripple, Tooltip, Modal) render their
// motion elements through `LazyMotion`, whose `features` prop does a dynamic
// `import("@heroui/dom-animation")`. Jest's CommonJS VM rejects that dynamic
// import ("invoked without --experimental-vm-modules"), crashing any test that
// mounts those components.
//
// We keep the real framer-motion but: (1) make LazyMotion a passthrough so no
// feature module is dynamically imported, and (2) point `m` (the lazy motion
// proxy that needs LazyMotion features) at the full `motion` proxy, whose
// components bundle their own features and render standalone.
const actual = jest.requireActual("framer-motion");

module.exports = {
  ...actual,
  LazyMotion: ({ children }) => children,
  m: actual.motion,
};
