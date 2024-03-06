declare module 'express' {
  interface Request {
    user: { id: number };
  }
}

export {};
