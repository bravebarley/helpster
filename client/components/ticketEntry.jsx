import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import FeedbackModal from './feedbackModal.jsx';
import io from 'socket.io-client';

class TicketEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      now: new Date()
    };
  }
  componentDidMount() {
    this.timer = setInterval(() => this.setState({ now: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    let claimButton = null;
    let closeButton = null;
    let claimed = null;
    let className = null;
    let time = null;
    let feedback = null; 

    if (this.props.ticket.status === 'Opened') {
      className = 'alert-success';
      time = `opened ${moment(this.props.ticket.createdAt).from(this.state.now)}`;
    } else if (this.props.ticket.status === 'Claimed') {
      claimed = <div className="ticket_list_entry_claimed">by {this.props.ticket.userClaimed.firstName} {this.props.ticket.userClaimed.lastName}</div>;
      className = 'alert-info';
      time = `claimed ${moment(this.props.ticket.claimedAt).from(this.state.now)}`;
    } else {
      className = 'alert-danger';
      time = `closed ${moment(this.props.ticket.closedAt).from(this.state.now)}`;
    }

    if (this.props.ticket.status === 'Opened' && this.props.ticket.userId !== this.props.user.id) {
      claimButton = <button onClick={() => this.props.updateTickets({ id: this.props.ticket.id, status: 'Claimed' }) }  type="button" className="btn btn-xs btn-primary claim_btn">Claim</button>;
    }

    if (this.props.ticket.status !== 'Closed' && (this.props.ticket.claimedBy === this.props.user.id || this.props.ticket.userId === this.props.user.id || this.props.user.role === 'admin')) {
      closeButton = <button onClick={() => this.props.updateTickets({ id: this.props.ticket.id, status: 'Closed', user: this.props.ticket.user}) } type="button" className="btn btn-xs btn-danger">Close</button>;
    }

    // if (this.props.ticket.status === 'Closed' &&  (this.props.user.role === 'mentor'  || his.props.user.role === 'admin' )) {
    //   closeButton = <button onClick={() => this.props.updateTickets({ id: this.props.ticket.id, status: 'Closed' }) } data-toggle="modal" data-target="#myModal" type="button" className="btn btn-xs btn-danger">Close</button>;
    // }

    return (
      <div className={`ticket_list_entry alert ${className} clearfix`}>
        <div className="ticket_list_entry_meta clearfix">
          <div className="ticket_list_entry_name">{this.props.ticket.user.firstName} {this.props.ticket.user.lastName} ({this.props.ticket.location})</div>
          <div className="ticket_list_entry_time">- {time}</div>
          {claimed}
        </div>
        <div className="ticket_list_entry_buttons">
          <span className="btn btn-xs btn-default">{this.props.ticket.category}</span>
          {claimButton}
          {closeButton}
        </div>
        <div className="ticket_list_entry_description">
          {this.props.ticket.description}
        </div>
      </div>
    );
  }
}

export default TicketEntry;




