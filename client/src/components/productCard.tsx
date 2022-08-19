import React, { FC, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import store, { toggleFavorite } from '../store';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';

import { unfavorite, favorite } from "../products";

interface ProductProps {
    classes: {
        card: string;
        media: string;
        actions: string;
        margin: string;
        divider: string;
        flex: string;
        right: string;
    };
    baseUrl: string;
    item: {
        itemName: string;
        maxBid: string;
        image: string;
        state: string;
        color: string;
        itemId: string;
        startingBid: string;
        auction: {
            auctionId: string;
        };
    };
}

const styles = (theme: Theme) => ({
    card: {
        marginTop: theme.spacing.unit * 1,
        marginBottom: theme.spacing.unit * 1,
        marginLeft: theme.spacing.unit * 1,
        fontSize: '16px',
        maxWidth: 249,
    },
    media: {
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit,
        height: 0,
        paddingTop: '56.25%'
    },
    actions: {
        display: 'flex',
    },
    margin: {
        margin: theme.spacing.unit * 3,
        width: "100%"
    },
    divider: {
        marginTop: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit,
        height: 0,
        paddingTop: "1%"
    },
    flex: {
        display: 'flex',
    },
    right: {
        marginLeft: 'auto'
    }
});

const Product: FC<ProductProps> = ({ classes, baseUrl, item }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [elevation, setElevation] = useState(0);

    useEffect(() => {
        setIsFavorite(isFavorite(item.auction.auctionId));
    }, []);

    const isFavorite = (id: string): boolean => {
        return store.getState().favorites.includes(id);
    };

    const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        (isFavorite(item.auction.auctionId) ?
            unfavorite(item.auction.auctionId) : favorite(item.auction.auctionId))
            .then(res => {
                store.dispatch(toggleFavorite(item.auction.auctionId));
                setIsFavorite(isFavorite(item.auction.auctionId));
            }).catch(console.log);
    };

    const { itemName, maxBid, image, state, color, itemId, startingBid, auction } = item;

    return (
        <div
            onMouseEnter={() => {
                setElevation(20);
            }}
            onMouseLeave={() => {
                setElevation(0);
            }}
        >
            <Card square elevation={elevation} className={classes.card}>
                <CardActions>
                    <Tooltip title="Save to favorites">
                        <IconButton color="secondary" size="small" onClick={handleFavorite}>
                            <Icon>{isFavorite ? "favorite" : "favorite_outline"}</Icon>
                        </IconButton>
                    </Tooltip>
                    <Typography gutterBottom variant="headline" component="h3" className={classes.right}>
                        Rs.{startingBid}</Typography>
                </CardActions>
                <Typography style={{ color: color, fontWeight: "lighter" }} className={classes.margin} gutterBottom variant="headline" component="h3">
                    {state}</Typography>

                <Link to={baseUrl + itemId} className={classes.right}>
                    <CardMedia className={classes.media} image={image}></CardMedia>
                    <CardContent>
                        <div className={classes.flex}>
                            <Typography gutterBottom variant="headline" component="h3" style={{ fontWeight: "lighter" }}>
                                {itemName}</Typography>
                            <Typography
                                className={classes.right}
                                style={{
                                    fontWeight: 400,
                                    color: "#6b6b6b"
                                }}
                            > {maxBid} </Typography>
                        </div>

                    </CardContent>
                </Link>
            </Card>
        </div>
    );
};

Product.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    bid: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        isFavorite: state.isFavorite
    };
}

export default connect(mapStateToProps)(withStyles(styles)(Product));