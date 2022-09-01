import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import LocationIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import UserIcon from '@material-ui/icons/VerifiedUser';

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  },
  paper: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit,
    width: 500,
    height: 500
  },
  close: {
    marginLeft: theme.spacing.unit * 60
  },
  avatar: {
    margin: 10,
    marginLeft: 20
  },
  bigAvatar: {
    width: 140,
    height: 140,
    color: '#fff',
    backgroundColor: '#4351aa'
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#4351aa'
  },
  typo: {
    margin: theme.spacing.unit,
    color: '#11a6e5',
    fontWeight: 'lighter'
  }
});

interface UserProfileProps {
  userObject: {
    userName: string;
    userEmail: string;
    userPhone: string;
    userAddress: string;
  };
  classes: {
    margin: string;
    paper: string;
    close: string;
    avatar: string;
    bigAvatar: string;
    purpleAvatar: string;
    typo: string;
  };
  handleClose: () => void;
  isOpen: boolean;
}

const UserProfile: FC<UserProfileProps> = ({
  userObject,
  classes,
  handleClose,
  isOpen
}) => {
  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogContent>
          <CloseIcon className={classes.close} onClick={handleClose} />
          <Grid container spacing={24}>
            <Grid item xs={4} xl={4} sm={4} lg={4}>
              <Avatar className={classNames(classes.avatar, classes.bigAvatar)}>
                <UserIcon />
                {userObject.userName}
              </Avatar>
            </Grid>
            <Grid item xs={8} xl={8} sm={8} lg={8}>
              <Typography className={classes.typo}>
                <EmailIcon />
                {userObject.userEmail}
              </Typography>
              <Typography className={classes.typo}>
                <PhoneIcon />
                {userObject.userPhone}
              </Typography>
              <Typography className={classes.typo}>
                <LocationIcon /> {userObject.userAddress}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

UserProfile.propTypes = {
  userObject: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    userPhone: PropTypes.string.isRequired,
    userAddress: PropTypes.string.isRequired
  }).isRequired,
  classes: PropTypes.shape({
    margin: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    close: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    bigAvatar: PropTypes.string.isRequired,
    purpleAvatar: PropTypes.string.isRequired,
    typo: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(UserProfile);