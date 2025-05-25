interface RequestWithUser extends Request {
  user: {
    userId: string;
    role: string;
  };
}

export  {RequestWithUser};

