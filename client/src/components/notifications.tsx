import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import store, { newBid } from '../store'
import BiddingTemplate from '../components/biddingTemplate'
import { getAuctionDetails } from '../products'

interface NotificationsProps {
  classes: any;
  match: any;
  products: any;
}

interface NotificationsState {
  live: any[];
  auctionDetails: any[];
}

const styles = {

}

class Notifications extends Component<NotificationsProps, NotificationsState> {
  constructor(props: NotificationsProps) {
    super(props)
    this.state = {
      live: [],
      auctionDetails: []
    }
  }
  componentDidMount() {
    console.log("STATUS", store.getState())
    let auctions = store.getState().auctions
    let notification: any[] = []

    if (auctions !== null) {
      console.log("INSIDE", auctions)
      auctions.map((auction: any) => {
        console.log("auction", auction)
        if (auction.state == "LIVE") {
          console.log("LIVE")
          console.log("AUCTION STATE", store.getState().auctions[0])
          notification.push(auction.id)
          getAuctionDetails(auction.id)
            .then(res => {
              let data = res
              let x = this.state.auctionDetails
              x.push(data)
              this.setState({
                auctionDetails: x
              })
            })

        }
      })
    }

    this.setState({
      live: notification
    })
  }
  render() {
    const { classes, match, products } = this.props
    console.log(match)
    console.log("CHECKING REDUX STORE", products)
    console.log("details", this.state.auctionDetails)
    return (
      <div className={classes.root}>
        <Typography
          style={{
            fontSize: "30px",
            color: "black",
            fontWeight: "lighter"
          }}
          align="center"
        >Notifications</Typography>
        {this.state.auctionDetails.map(auction => {
          return (
            <BiddingTemplate
              bidAmount="100"
            />
          )
        })}
      </div>
    )
  }
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired,
  products: PropTypes.object.isRequired
};

function mapStateToProps(state: any) {
  return {
    products: state.products
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Notifications));