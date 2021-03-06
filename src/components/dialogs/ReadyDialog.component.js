import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class ReadyDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setOpen = this.setOpen.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  setOpen(bool) {
    this.setState({ open: bool });
  }

  handleClickOpen() {
    this.setOpen(true);
  }

  handleClose() {
    this.setOpen(false);
    this.props.updateReadyToVote();
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          disableBackdropClick
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Ready to vote?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you ready to cast your vote on the blockchain?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Yes, I'm ready.
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ReadyDialog;
