// Manual mock for @auth0/nextjs-auth0's client entry, applied automatically to
// every test (it sits in <rootDir>/__mocks__ for a node_modules package).
//
// The real package only declares an "import" (ESM) export condition — no
// "require"/"default" — so jest's CommonJS resolver can't load it and any test
// that (transitively) imports it fails with "Cannot find module". The few
// components that use it only need the `useUser` hook, so we expose a single
// shared jest.fn(); tests drive it with useUserMock.mockReturnValue(...).
const useUser = jest.fn(() => ({ user: undefined, isLoading: false }));

module.exports = { useUser };
