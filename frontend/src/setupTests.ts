import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill for TextEncoder/TextDecoder (needed for React Router)
Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

globalThis.localStorage = localStorageMock as any