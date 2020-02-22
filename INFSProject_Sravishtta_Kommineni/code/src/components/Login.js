import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import fire from '../config/Fire';
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Stocker
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {email:'', password:'', message:'', displayMessage: false};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    handleChange(e){

        this.state[e.target.name] = e.target.value;
        this.setState(this.state);
        console.log(e.target.value);

    }

    handleSubmit(e){
        let _this = this;
        e.preventDefault();

        fire.auth.signInWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{

        }).catch(err =>{

            let newState = _this.state;
            newState.message = err.message;
            _this.setState(newState);
            console.log(err);
        });
        console.log(e);

    }

    handleSignUp(){

        let _this = this;
        fire.auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
            console.log(user);
        }).catch(err =>{

            let newState = _this.state;
            newState.message = err.message;
            _this.setState(newState);
            console.log(err);
        });

    }
    render(){

        return (
            <Container maxWidth={"md"}r>

                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                    open={this.state.message}
                    message={this.state.message}
                    autoHideDuration={0.01}
                >


                </Snackbar>


                <AppBar position="static" style={{marginBottom:"20px" }} >
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                        </IconButton>
                        <Typography variant="h6" >
                            Stocker
                        </Typography>
                    </Toolbar>
                </AppBar>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>

                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form onSubmit={this.handleSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        onChange={this.handleChange}
                        value={this.state.email}
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={this.handleChange}
                        value={this.state.password}
                        autoComplete="current-password"
                    />
                    <Button
                        styles={{marginTop: '20px'}}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            <Box m={2}>

                            <Button
                                onClick={this.handleSignUp}
                                fullWidth
                                variant="contained"
                                color="link"
                            >
                                Sign Up
                            </Button>
                            </Box>

                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
            </Container>
    );}
}