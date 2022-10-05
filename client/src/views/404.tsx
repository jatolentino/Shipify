import React, { Component, FC } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';

interface ErrorProps {
  errorMessage: string;
}

interface ErrorState {
  home: boolean;
}

class Error extends Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = {
      home: false
    };
  }

  handleHome(): void {
    this.setState({
      home: true
    });
  }

  render(): JSX.Element {
    const { errorMessage } = this.props;
    return (
      <div>
        <Typography>
          <h1>Error !!! {errorMessage}</h1>
        </Typography>
        <Button color="inherit" onClick={this.handleHome.bind(this)}>
          Home
        </Button>
        {this.state.home && <Redirect to="/" />}
      </div>
    );
  }
}

export default Error;