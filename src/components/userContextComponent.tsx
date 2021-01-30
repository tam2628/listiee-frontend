import { useState } from 'react';
import UserContext, { User } from './../userContext';

const UserContextComponent = (props:any) => {
    const [user, setUser] = useState<User|null>(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContextComponent;