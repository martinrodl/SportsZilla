import React, { useState, ReactElement } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Apollo from '../ApolloClient/Apollo';
import './Main.scss';
import Navbar from '../Navbar/Navbar';
import Intro from '../Intro/Intro';
import Join from '../User/Join/Join';
import Login from '../User/Login/Login';
import SignUp from '../User/SignUp/SignUp';
import Profile from '../User/Profile/Profile';
import Data from '../../mockData/data.json';
import Board from '../Board/Board';
import CreateEvent from '../CreateEvent/CreateEvent';
import { UserData } from '../User/UserData';

function Main(): ReactElement {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<UserData>({ email: '' });

  const [events, setEvents] = useState<object[]>([Data.events]);
  const [sport, setSport] = useState<object[]>([Data.sports]);

  return (
    <div className="Main">
      <header>
        <Navbar />
      </header>
      <main>
        <Switch>
          <Route path="/intro/">
            <Intro />
          </Route>
          <Route path="/board/">
            <Board />
          </Route>
          <Route path="/apollo/">
            <Apollo />
          </Route>
          <Route exact path="/newevent/">
            <CreateEvent user={undefined} />
          </Route>
          <Route exact path="/user/join/">
            <Join />
          </Route>
          <Route exact path="/user/login/">
            <Login setUser={setLoggedInUser} />
          </Route>
          <Route exact path="/user/signup/">
            <SignUp setUser={setLoggedInUser} />
          </Route>
          <Route exact path="/user/profile/">
            <Profile user={undefined} setUser={setLoggedInUser} />
          </Route>
          <Redirect from="/" to="/intro/" />
        </Switch>
      </main>
    </div>
  );
}

export default Main;
