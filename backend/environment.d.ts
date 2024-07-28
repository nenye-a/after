declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'staging';
      MONGO_USER: string;
      MONGO_PASSWORD: string;
      OPENAI_API_KEY: string;
    }
  }
}

export {};
