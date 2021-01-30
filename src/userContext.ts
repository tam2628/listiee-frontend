import { createContext } from 'react';

export interface User {
    accessToken: string;
    email: string;
    id: string;
    firstName: string;
    lastName: string;
};

const userContext = createContext<any>(null);

export default userContext;