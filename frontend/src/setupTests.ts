import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

declare global {
  var TextEncoder: typeof import('util').TextEncoder
  var TextDecoder: typeof import('util').TextDecoder
}

// Polyfill for TextEncoder/TextDecoder (needed for React Router)
globalThis.TextEncoder = TextEncoder
globalThis.TextDecoder = TextDecoder as any

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

globalThis.localStorage = localStorageMock as any