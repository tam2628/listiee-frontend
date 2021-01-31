import { HashRouter as Router, Switch, Route} from 'react-router-dom';
import Index from './components/index';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import UserContextComponent from './components/userContextComponent';
import ProtectedRoute from './components/protectedRoute';

const P_Dash = ProtectedRoute(Dashboard, "/");

function App() {
  return (
    <UserContextComponent>
      <Router>
        <Switch>
          <Route exact path="/" component={Index}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/dash" component={P_Dash}/>
        </Switch>
      </Router>
    </UserContextComponent>
  );
}

export default App;
