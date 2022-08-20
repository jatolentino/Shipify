import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Toolbar from '@material-ui/core/Toolbar'
import { Rate, updateRate } from "../products";
import Grid from '@material-ui/core/Grid'
import { CustomButton } from "./buttons";
import Divider from '@material-ui/core/Divider'
import store, { subscribeAuctionAction, updateAuctionListAction, getHighestBid, newBid } from '../store'
import { Redirect } from 'react-router-dom'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { participateInAuction, getAuctionDetails, setBid, getBidDetails, fetchEach } from '../products'
import BootStrappedInput from '../components/textFields'
import moment from 'moment'
import TextField from '@material-ui/core/TextField'
import Favorite from '@material-ui/icons/FavoriteBorder'
import Button from '@material-ui/core/Button'
import { getRating } from "../products";
import { baseUrl } from "../config";
import { getFavorites, fetchItemDetails } from "../products";
import { subscribeAuction } from "../socket";
import SnackBar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import LinearProgress from '@material-ui/core/LinearProgress';
import Result from '../components/result'
import DropDown from '@material-ui/icons/ArrowDropDown'
import Rating from 'react-rating'
import Red from '../../src/assets/images/red.png'
import Grey from '../../src/assets/images/grey.png'

interface ProductDetailsProps {
  classes: any;
  match: any;
}

const ProductDetails: FC<ProductDetailsProps> = ({ classes, match }) => {
  const [details, setDetails] = useState({});
  const [count, setCount] = useState(0);
  const [image, setImage] = useState(null);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [isOnline, setIsOnline] = useState(store.getState().isLoggedIn);
  const [openDialog, setOpenDialog] = useState(false);
  const [participated, setParticipated] = useState(false);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);
  const [buttonName, setButtonName] = useState("Participate");
  const [timeDifference, setTimeDifference] = useState(null);
  const [eventDateTime, setEventDateTime] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [eventStarted, setEventStarted] = useState(false);
  const [eventEnded, setEventEnded] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [minutes, setMinutes] = useState(10);
  const [highestBid, setHighestBid] = useState(0);
  const [bids, setBids] = useState([]);
  const [forHighestBid, setForHighestBid] = useState([]);
  const [forHighestBidder, setForHighestBidder] = useState([]);
  const [bidReject, setBidReject] = useState(false);
  const [currentBidder, setCurrentBidder] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [currentHighest, setCurrentHighest] = useState(0);
  const [timeSlice, setTimeSlice] = useState(0);
  const [localHighest, setLocalHighest] = useState(0);
  const [openResult, setOpenResult] = useState(false);
  const [rate, setRate] = useState(0);
  const [ratings, setRatings] = useState([0, 0, 0, 0, 0]);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (store.getState().isLoggedIn) {
      getFavorites().then(res => {
        if (res.length > 0) {
          res.map(favorite => {
            subscribeAuction(favorite)
          })
        }

      }).catch(err => console.log(err))

    }

    tick()

  }, []);

  const tick = () => {
    setInterval(handleDuration, 1000)

  }

  const handleDuration = () => {
    if (eventStarted) {
      if (minutes >= 1) {
        if (seconds <= 0) {
          setMinutes(minutes - 1);
          setSeconds(60);
        }
        else {
          setSeconds(seconds - 1);
        }
      }

      else {
        setEventEnded(true);
      }
    }
    else {
      let duration_ = moment.duration(eventDateTime - moment())
      let duration = duration_._data

      let total_minutes = Number(Math.abs(Number(duration.hours)) * 60 + Math.abs(Number(duration.minutes)) + Math.abs(Number(duration.seconds / 60)))
      let minutes = Math.floor(total_minutes)
      let seconds = Math.floor((total_minutes - minutes) * 60)


      if (duration_ > 0) {

        setTotalTime(duration);
      }
      else {

        if (total_minutes < timeSlice) {

          setMinutes(timeSlice - minutes);
          setSeconds(60 - seconds);
          setEventStarted(true);
        }
        else {
          setEventEnded(true);
        }

      }

    }
  }

  if (count === 0) {
    fetchItemDetails(match.params.id)
      .then((res) => {
        let details = res
        setDetails(details);

        setImage(details.image);

        let auction = details.auction
        let participated = false
        let buttonName = "Participate"
        auction.bidders.map((bidder) => {
          if (bidder == userId) {
            participated = true,
              buttonName = "Bid"
          }
        })

        auction.bids.map((bid) => {
          getBidDetails(bid.bidId)
            .then((res) => {

              setBids([...bids, {
                auctionId: res.auction.auctionId,
                userId: res.bidder,
                bidAmount: res.bidAmount
              }]);
              setForHighestBidder([...forHighestBidder, res.bidder]);
              setForHighestBid([...forHighestBid, res.bidAmount]);
            })
        })
        let data = auction
        setAuctionDetails(auction);
        setAlreadyParticipated(participated);
        setButtonName(buttonName);
        setMinutes(Number(data.auctionDuration) * 60);
        setTimeSlice(Number(data.auctionDuration) / 60);
        setEventDateTime(moment(data.auctionDate + ' ' + data.auctionTime));
        getRating(id)
          .then(ratings => {
            let oneRating = 0, twoRating = 0, threeRating = 0, fourRating = 0, fiveRating = 0;
            ratings.map((rating) => {
              if (rating.userId === store.getState().user.userId) {
                setHasRated(true);
                setRate(rating.rating);
              }
              if (rating.rating === 5) {
                fiveRating += 1;
              }
              if (rating.rating === 1) {
                oneRating += 1;
              }
              if (rating.rating === 2) {
                twoRating += 1;
              }
              if (rating.rating === 3) {
                threeRating += 1;
              }
              if (rating.rating === 4) {
                fourRating += 1;
              }
            })


            ratings = [oneRating, twoRating, threeRating, fourRating, fiveRating];
            setRatings(ratings);

          }).catch(err => console.log(err))


      })


  }

  return (

    <div className={classes.root}>
      <div style={{ display: 'none' }}>

      </div>
      <Paper
        square
        elevation={0}
        className={classes.paper}
      >

        <Card
          elevation={0}
          square
          className={classes.card}>
          <Grid container spacing={24} >
            <Grid item xs={6}>
              <CardMedia
                className={classes.media}
                image={image}
              />
              <div className={classes.baseMargin}>
                <Typography
                  align="left"
                  className={classes.title}
                  style={{ fontSize: 20 }}
                >{details.itemName}

                </Typography>

                <Typography
                  className={classes.description}
                  style={{ fontSize: 14 }}
                >{details.itemDescription}
                </Typography>
                <Typography
                  className={classes.description}
                  style={{ fontSize: 17 }}
                >STARTING BID
                                    </Typography>
                <Typography
                  className={classes.description}
                  style={{ fontSize: 17 }}
                >Rs. {details.startingBid}
                </Typography>
                <br />
                {[5, 4, 3, 2, 1].map((x, key) => {
                  return <div>
                    <Grid spacing={24}>
                      <Grid item xs={6}>

                        <Rating
                          readonly
                          initialRating={x}
                          emptySymbol={<img src={Grey} style={{ width: 20, height: 20 }} className="icon" />}
                          fullSymbol={<img src={Red} style={{ width: 20, height: 20 }} className="icon" />}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography style={{ margin: 1 }}>
                          {ratings[key]} people rated {x}
                        </Typography>
                      </Grid>



                    </Grid>

                  </div>
                })}
              </div>

            </Grid>
            <Grid item xs={6}>
              <Typography
                align="left"
                className={classes.title}
              >{details.itemName}

              </Typography>
              <Typography className={classes.title} style={{ marginTop: "20px" }}>
                Rs.{details.startingBid}
              </Typography>
              <Rating
                readonly={hasRated}
                initialRating={rate}
                onChange={(rate) => {
                  console.log("RATE", rate)
                  Rate(match.params.id, rate).then(res => { console.log(res) })
                  setRate(rate);
                  setHasRated(true);
                }}
                emptySymbol={<img src={Grey} style={{ width: 20, height: 20 }} className="icon" />}
                fullSymbol={<img src={Red} style={{ width: 20, height: 20 }} className="icon" />}
              />


              <Grid container spacing={24}>
                <Grid item xs={7}>
                </Grid>
                <Grid item xs={5}>
                  {
                    !eventEnded ? (!eventStarted ? <Typography className={classes.description} style={{ color: "#abacff" }}>
                      starts in  {`${totalTime.days}d ${totalTime.hours}h ${totalTime.minutes}m ${totalTime.seconds}s  `}

                    </Typography> : <div>


                        <Typography className={classes.description} style={{ color: 'green' }}>Ends in {minutes}m {seconds}s</Typography>
                      </div>) : <Typography style={{ fontSize: "15px", fontWeight: "lighter" }} align="left">Ended  On {auctionDetails.auctionDate}</Typography>
                  }
                  {

                  }

                </Grid>
              </Grid>


              {eventEnded && (
                <div>
                  {!openResult && <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setOpenResult(true);
                    }}
                  >Result <DropDown />
                  </Button>}

                </div>
              )}
              {
                eventEnded && (
                  <Result
                    isOpen={openResult}
                    handleClose={() => {
                      setOpenResult(false);
                    }}
                    highestBidder={localHighestBidder}
                    auctionObject={auctionDetails}
                    highestBid={localHighest}
                  />
                )
              }
              {eventStarted && <LinearProgress />}
              <Divider className={classes.paper} />
              {
                !eventEnded && (
                  <Paper square className={classes.biddingForm}>
                    <div className={classes.innerDiv}>
                      <br />
                      {alreadyParticipated ? (<div>
                        <Typography className={classes.subTitle} style={{ marginTop: "20px" }}>
                          Highest Bid Rs.{highestBid > localHighest ? highestBid : localHighest}
                        </Typography>
                        <TextField
                          className={classes.textMargin}
                          placeholder="Your Bid"
                          style={{ width: "90%" }}
                          fullWidth
                          onChange={(e) => {
                            setBidAmount(e.target.value);
                          }}
                        />
                      </div>) : <Typography className={classes.subTitle} style={{ marginTop: "20px" }}>
                          Participate now to get the live update
                      </Typography>}




                      <CustomButton
                        name={buttonName}
                        color="primary"
                        variant="contained"
                        style={{
                          width: "90%",
                          borderRadius: 0,
                          marginTop: "20px"
                        }}
                        property={classes.textMargin}
                        handler={() => {

                          if ((participated || alreadyParticipated) && ((bidAmount < details.startingBid) || (bidAmount <= highestBid))) {
                            setBidReject(true);
                          }
                          else {
                            let today = moment()
                            let auction = auctionDetails
                            let biddingObject = {
                              bidderId: store.getState().user.userId,
                              itemId: id,
                              auctionId: auction.auctionId,
                              bidAmount: bidAmount,
                              bidDate: `${today.format('YYYY-MM-DD')}`,
                              bidTime: `${today.format('HH:mm:ss')}`

                            }

                            if (!alreadyParticipated) {
                              subscribeAuction(auction.auctionId)

                              participateInAuction(auction.auctionId)
                                .then(res => {
                                  let auction = {
                                    ...auctionDetails,
                                    id: auctionDetails.auctionId,
                                    state: 'READY',
                                    bids: bids
                                  }

                                  let found = false
                                  store.getState().auctions.map((auction) => {
                                    if (auction.auctionId === auction) {
                                      found = true
                                    }
                                  })
                                  if (!found) {
                                    store.dispatch(updateAuctionListAction(auction))
                                  }

                                  setParticipated(true);
                                  setButtonName("Bid");
                                  setAlreadyParticipated(true);
                                })
                            }
                            else {
                              setBid(biddingObject)
                                .catch(console.log)
                            }
                          }
                        }
                        }
                      />
                      <Divider className={classes.subTitle} />
                      <Button

                        color="secondary"
                        variant="outlined"
                        style={{
                          width: "90%",
                          borderRadius: 0
                        }}
                        className={classes.textMargin}
                        onClick={() => {
                          participateInAuction(auctionDetails.auctionId).then(res => { console.log("Auction Added", res) })

                        }}>
                        <Favorite variant="outlined" />
                        Save this item

                      </Button>


                    </div>
                  </Paper>

                )
              }


            </Grid>
          </Grid>
        </Card>
      </Paper>
      <SnackBar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={bidReject}
        autoHideDuration={6000}
        onClose={() => {
          setBidReject(false);
        }}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Oops!!! You bid is less than the current bid </span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={() => {
              setBidReject(false);
            }}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />

      {
        (isOnline === undefined | !(isOnline)) && (
          <Redirect to="/login" />
        )
      }

    </div>
  )
}

ProductDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme: Theme) => {
  return {
    paper: {

      marginTop: theme.spacing.unit * 2

    },
    biddingForm: {
      margin: theme.spacing.unit,
      height: 350,
      opacity: 0.9,

    },
    card: {
      height: "60%",
      maxWidth: "100%",
      width: "100%",
      margin: theme.spacing.unit,

    },
    media: {
      marginLeft: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 3,
      height: 0,
      paddingTop: '56.25%'
    },
    title: {
      fontSize: 26,
      fontWeight: 300,
      color: "black",
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,

    },
    subTitle: {
      fontSize: 16,
      fontWeight: 200,
      color: "black",
      marginLeft: theme.spacing.unit * 5,
      marginRight: theme.spacing.unit * 5,
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,

    },
    top: {
      fontSize: 20,
      fontWeight: 200,
      color: "#050505",
      marginTop: theme.spacing.unit
    },
    description: {
      fontSize: 14,
      fontWeight: 200,
      color: "#050505",
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: theme.spacing.unit,
    },
    actions: {
      display: 'flex',
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
      marginLeft: 'auto',
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    link: {
      color: "black",
      opacity: "0.8",
      '&:hover': {
        textDecoration: "underline"
      }

    },
    margin: {
      marginLeft: theme.spacing.unit * 30,
      marginRight: theme.spacing.unit * 30,
      marginTop: theme.spacing.unit * 2,

    },
    baseMargin: {
      margin: theme.spacing.unit * 2
    }
    ,
    textMargin: {
      marginLeft: theme.spacing.unit * 5,
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 1
    },
    innerDiv: {
      marginRight: theme.spacing.unit * 5
    }

  }
}

export default (withStyles(styles)(ProductDetails));