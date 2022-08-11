import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const styles = {
    card: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
};

interface BiddingCardProps extends WithStyles<typeof styles> {
    bidAmount: string;
}

const BiddingCard: FC<BiddingCardProps> = (props) => {
    const { classes } = props;
    return (
        <div>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                />
                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        {props.bidAmount}
                    </Typography>
                </CardContent>
                <CardActions>
                    <TextField
                        placeholder="Bid"
                    />
                    <Button
                        size="small"
                        color="primary"
                    >Bid
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}

BiddingCard.propTypes = {
    classes: PropTypes.object.isRequired,
    bidAmount: PropTypes.string.isRequired,
};

export default withStyles(styles)(BiddingCard);