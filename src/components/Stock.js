import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import RemoveIcon from "@material-ui/icons/Remove";
import RefreshIcon from '@material-ui/icons/Refresh';
import firebase from '../config/Fire';


export default class Stock extends React.Component {

    constructor(props) {
        super(props);
        this.data = props.data;

        this.state = {key: props.id, symbol: props.symbol, parentFunctionDelete: props.delete, price: props.price};
        this.handleParentCall = this.handleParentCall.bind(this);

    }

    handleParentCall(){

        /*
        delete from db
         */
        this.state.parentFunctionDelete(this.state.key);
    }

    render() {


        return (

            <Card raised={true} style={{margin: '15px'}}>
                <CardHeader title={this.state.symbol}
                />

                <CardContent>
                    <Typography color="textSecondary" component="p">
                        {this.state.price}
                    </Typography>

                    <Typography color="textSecondary" component="h6">
                        {new Date().toString()}
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton onClick={this.handleParentCall}>
                        <RemoveIcon/>
                    </IconButton>

                    <IconButton>
                        <RefreshIcon/>
                    </IconButton>

                </CardActions>
            </Card>
        );
    }
}
