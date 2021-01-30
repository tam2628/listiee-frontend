import React from 'react';
import UserContext from './../userContext';
import { Redirect } from 'react-router-dom';
import { REFRESH_URL } from './../constants';

function ProtectedRoute <P extends object> (Component:React.ComponentType<P>, to:string) {
    return class PR extends React.Component<P> {
        static contextType = UserContext;

        state = {
            redirect: false,
        };

        async refresh() {
            if((this.context as any).accessToken != null){
                return;
            }

            const res = await fetch(REFRESH_URL,{
                credentials: 'include'
            });

            if(res.status === 400){
                this.setState({...this.state, redirect: true});
            }

            if(res.status === 200){
                const user = await res.json();
                (this.context as any).setUser(user);
            }
        }

        componentDidMount() {
            this.refresh();
        }

        render() {
            return this.state.redirect ? <Redirect to={to} push={true}/> : <Component {...this.props as P}/>;
        }
    }
}

export default ProtectedRoute;