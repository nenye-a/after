declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_USER: string;
      MONGO_PASSWORD: string;
      NODE_ENV: "development" | "production" | "staging";
    }
  }
}

export {};
