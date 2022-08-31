import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = (theme: any) => ({

});

interface ProfileProps extends WithStyles<typeof styles> {
}

class Profile extends Component<ProfileProps> {
    componentDidMount() {
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Typography
                    style={{
                        fontSize: "30px",
                        color: "black",
                        fontWeight: "lighter"
                    }}
                    align="center"
                >Cart</Typography>
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);