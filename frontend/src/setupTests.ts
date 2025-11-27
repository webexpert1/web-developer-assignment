import '@testing-library/jest-dom';

// Polyfill for TextEncoder which is needed by React Router
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;