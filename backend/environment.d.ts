declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'staging';
      MONGO_USER: string;
      MONGO_PASSWORD: string;
      OPENAI_API_KEY: string;
      EVENTBRITE_PRIVATE_TOKEN: string;
      GOOGLE_API_KEY: string;
      HERE_API_ID: string;
      HERE_API_KEY: string;
      AUTH0_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
    }
  }
}

export {};
