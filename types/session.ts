export interface Session {
  expires: string,
  user: {
      name: string;
      image: string;
      email: string;
    };
  }
