import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import fire from './config/Fire';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Typography from "@material-ui/core/Typography/Typography";
import MenuIcon from '@material-ui/icons/Menu';
class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {email:'', password:'', loggedIn: false};
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){

        this.authListener();

    }

    handleLogout(){

        let _this = this;
        fire.auth.signOut().then(user=>{

            _this.state.loggedIn = user;
            _this.setState(_this.state);
        });
    }

    authListener(){
         let _this = this;
        fire.auth.onAuthStateChanged((user) =>{

            console.log(user);
            if(user){
                this.setState({email: user.email, loggedIn: true});
            }
            else{
                this.setState(_this.state);
            }
        });
    }

  render(){

      return (

          <Container component="main">

              {!this.state.loggedIn && <Login/>}
              {this.state.loggedIn &&

              <Container>
              <AppBar position="static" >
                  <Toolbar>
                      <IconButton edge="start" color="inherit" aria-label="menu">
                      </IconButton>
                      <Typography variant="h6" >
                          Profile
                      </Typography>
                      <Button onClick={this.handleLogout}color="inherit" style={{margin: "5px"}}>Logout</Button>
                  </Toolbar>
              </AppBar>



                  <Dashboard email={this.state.email}/>
              </Container>}


          </Container>

      );
  };
}

export default App;
