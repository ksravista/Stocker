import React from 'react'
import Stock from './Stock';
import {Grid} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField/TextField";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import firebase from '../config/Fire';
import Autocomplete from '@material-ui/lab/Autocomplete';


let db = firebase.firestore;


export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {email: props.email, tickerSymbol: '', stocks: [], displayAlert: false, data: [], query:[]};
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeTickerSymbol = this.handleChangeTickerSymbol.bind(this);
        this.updateStockPrices = this.updateStockPrices.bind(this);
        this.handleTextBox = this.handleTextBox.bind(this);
        this.handleRefreshAll = this.handleRefreshAll.bind(this);
    }

    componentDidMount() {

        let _this = this;
        const docRef = db.collection('users').doc(_this.state.email).get().then(doc =>{

            console.log(doc);
            if(doc.exists){

                let newStocks = doc.data().stocks;
                let newState = _this.state;

                newState.stocks = newStocks;

                this.setState(newState);

            }


            _this.updateStockPrices(false);

        });


    }

    updateStockPrices(justRefresh) {

        let _this = this;

        for (let symbol of this.state.stocks) {
            fetch('https://financialmodelingprep.com/api/v3/stock/real-time-price/' + symbol).then(res => res.json()).then(data => {

                let newState = _this.state;

                newState.data = [];
                if(!justRefresh) {
                    newState.data.push(data);
                    _this.setState(newState);
                }
            })
        }
    }


    //start here
    handleDelete(symbol) {


        let result = this.state.data.find((obj, index) => {
            if (obj.symbol === symbol) {
                return index;
            }
        });


        let _this = this;
        const equalTo = (element) => element == result.symbol;
        db.collection('users').doc(this.state.email).get().then(doc =>{

            if(doc.exists){

                //console.log(result);

                let newStocks = doc.data().stocks;
                console.log(newStocks);

                let r = newStocks.findIndex(equalTo);

                newStocks.splice(r, 1);
                // const collectionRef = db.collection('users');

                // let docRef = collectionRef.doc(this.state.email);
                // docRef.set({
                //     stocks: newStocks
                // });

                let newState = this.state;
                newState.stocks = newStocks;

                _this.updateStockPrices(false);
                this.setState(newState);

            }

        });



    }

    handleAdd() {

        if (this.state.tickerSymbol) {

            //write to the database
            //update the state
            let newState = this.state;
            newState.displayAlert = false;
            let _this = this;

            fetch('https://financialmodelingprep.com/api/v3/stock/real-time-price/' + this.state.tickerSymbol).then(res => res.json()).then(data => {

                let newState = _this.state;

                if (!data.symbol) {
                    newState.displayAlert = true;
                    newState.snackbarMessage = 'Enter Valid Ticker Symbol';
                    this.setState(newState);
                }

                else {

                    //already exists or not
                    let result = this.state.data.find((obj) => {
                        return obj.symbol == data.symbol
                    });

                    if (!result) {

                        const docRef = db.collection('users').doc(this.state.email).get().then(doc =>{

                            if(doc.exists){

                                let newStocks = doc.data().stocks;
                                newStocks.push(data.symbol);
                                const collectionRef = db.collection('users');

                                let docRef = collectionRef.doc(this.state.email);
                                docRef.set({
                                    stocks: newStocks
                                });

                            }

                            else{
                                const collectionRef = db.collection('users');

                                let docRef = collectionRef.doc(this.state.email).set({
                                    stocks:[data.symbol]
                                });
                            }
                        });
                        //update the state
                        _this.state.data.push(data);
                        _this.setState(newState);
                    }

                    else {

                        newState.displayAlert = true;
                        newState.snackbarMessage = 'This Stock Already Exists in Your Profile: ' + data.symbol;
                        this.setState(newState);

                    }
                }

            })
        }

        else {
            let newState = this.state;

            newState.displayAlert = true;
            newState.snackbarMessage = 'Enter Valid Ticker Symbol';
            this.setState(newState);

        }
    }

    handleChangeTickerSymbol(e, params) {


        if(params) {
            this.state.tickerSymbol = params.symbol;
            console.log(params);
            this.setState(this.state);
        }

        else{
            this.state.tickerSymbol = "";
            console.log(params);
            this.setState(this.state);
        }

    }

    handleTextBox(e){


        let newState = this.state;
        newState.tickerSymbol = e.target.value;
        newState.query = [];
        //console.log(newState);

        let _this = this;
        let stockRef = db.collection('stocks').orderBy("name").limit(5);

        if(newState.tickerSymbol != '') {
            stockRef.where("name", ">=", newState.tickerSymbol)
                .get()
                .then(function (querySnapshot) {

                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots

                        newState.query.push(doc.data());
                        _this.setState(newState);

                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        }

        //this.setState(newState);
    }

    handleRefreshAll(){

        this.updateStockPrices(true);
    }

    render() {

        return (

            <Container>
                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                    open={this.state.displayAlert}
                    message={this.state.snackbarMessage}
                    autoHideDuration={60}

                >

                </Snackbar>

                <Container>

                    <Autocomplete
                        id="combo-box-demo"
                        options={this.state.query}
                        getOptionLabel={option => (option.name + ' (' +option.symbol+')')}
                        style={{ width: 300 }}
                        onChange={this.handleChangeTickerSymbol}
                        renderInput={params => (
                            <TextField {...params} label="Ticker Symbol" variant="outlined" fullWidth onChange={this.handleTextBox}/>
                        )}
                        autoComplete={true}
                    />

                        <IconButton styles={{marginTop: "10px"}} onClick={this.handleAdd}>
                            <AddIcon/>
                        </IconButton>

                    <IconButton styles={{marginTop: "10px"}} onClick={this.handleRefreshAll}>
                        <RefreshIcon/>
                    </IconButton>

                </Container>


                <Grid container spacing={24}>

                    {this.state.data.map((item) => {

                        return (<Grid item sm={3}>
                            <Stock id={item.symbol} key={item.symbol} symbol={item.symbol} price={item.price} delete={this.handleDelete}/>

                        </Grid>);

                    })}
                </Grid>
            </Container>


        );
    }


}