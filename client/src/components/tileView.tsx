import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import ProductCard from './product-card'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

interface TileViewProps extends WithStyles<typeof styles> {
    items: any[];
    basePath: string;
    title: string;
}

const TileView: FC<TileViewProps> = (props) => {
    const { classes, items, basePath, title } = props;

    if (items.length === 0)
        return null;

    return (
        <Paper
            className={classes.mainRoot}
            square
            elevation={0}
        >
            <Typography className={classes.title} align="center">
                {title}
            </Typography>

            <Grid container className={classes.root} spacing={10}>
                {items.map(value => (
                    <Grid key={value} item xs={12} sm={6} md={4} lg={3} xl={2} className={classes.item}>
                        <ProductCard
                            item={value}
                            isFavorite={value.isFavorite}
                            baseUrl={basePath}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

TileView.propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
};

export default withStyles(styles)(TileView);