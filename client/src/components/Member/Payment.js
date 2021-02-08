import axios from 'axios';
import {useEffect, useState} from 'react';
import Transaction from './Transaction'
import numeral, { set } from 'numeral'
import moment from 'moment'
import {Link} from 'react-router-dom'

export default function Pending() {
  const [activeRequests, setActiveRequests] = useState([])
  const [inactiveRequests, setInactiveRequests] = useState([])
  const [receivedPayments, setReceivedPayments] = useState([])
  const [outgoing, setOutgoing] = useState(false)
  const [completed, setCompleted] = useState(true)
  const [received, setReceived] = useState(false)

  const getRequests = async () => {
    const resp = await axios.get('/api/member/payment/list')
    console.log(resp.data.filter(d => d.type === 'payment'))
    const data = resp.data
    setActiveRequests(data.filter(d => d.status !== true && d.type === 'request'))
    setInactiveRequests(data.filter(d => d.status === true && d.type === 'request'))
    setReceivedPayments(data.filter(d => d.type === 'payment'))
  }

  const completedList = () => {
    if (!completed) {
      setCompleted(true)
      setOutgoing(false)
      setReceived(false)
    }
  }

  const outgoingList = () => {
    if (!outgoing) {
      setOutgoing(true)
      setCompleted(false)
      setReceived(false)
    }
  }

  const receivedList = () => {
    if (!received) {
      setReceived(true)
      setCompleted(false)
      setOutgoing(false)
    }
  }
  
  const selectedList = {
    backgroundColor: '#ffdab9',
    cursor: 'unset'
  }

  useEffect(()=>{
    getRequests()
  }, [])

  return (
    <section id="memberView">
      <div className="title">
        <h1>payments</h1>
        <h4><Link to="/member/request" className="request-link">requests <i className="fas fa-caret-right"></i></Link></h4>
      </div>

        <div className="paymentNav">
          <div className="titleBar">
            <h3
            onClick={receivedList}
            style={received ? selectedList : null}>
              received
            </h3>
          </div>

          <div className="titleBar">
            <h3 
            onClick={completedList}
            style={completed ? selectedList : null}
            >completed
          </h3>
          </div>
  
          <div className="titleBar">
              <h3 
              onClick={outgoingList}
              style={outgoing ? selectedList : null}
              >outgoing
              </h3></div>
        </div>

      
      <div className="receivedContentContainer">
        {
          received &&
          <div className="list">
            {
              receivedPayments &&
              receivedPayments.map(p => (
                <Transaction
                key={p.id}
                img={p.friendProfilePic}
                date={moment(p.createdAt).format('MMMM D, YYYY')}
                name={p.friendName}
                description={p.description}
                amount={numeral(p.amount).format('$0,0.00')}
                username={p.friendUsername}
                status={p.status}
                approved={p.approved}
                />
              ))
              }
            {
              !receivedPayments && 
              <div className="noNotif">
                <h1>no notifications</h1>
              </div>
            }
          </div>
        }
      </div>


      <div className="inactiveContentContainer">
        {
          completed && 
          <div className="list">
            {
              inactiveRequests &&
              inactiveRequests.map(r => (
                <Transaction
                key={r.id}
                img={r.friendProfilePic}
                date={moment(r.createdAt).format('MMMM D, YYYY')}
                name={r.friendName}
                description={r.description}
                amount={numeral(r.amount).format('$0,0.00')}
                username={r.friendUsername}
                status={r.status}
                approved={r.approved}
                />
              ))
            }
          </div>
        }
      </div>

        <div className="activeContentContainer">

        {  
            outgoing &&
            <div className="list">
            {
              activeRequests && 
              activeRequests.map(r => (
                <Transaction
                key={r.id}
                img={r.friendProfilePic}
                date={moment(r.createdAt).format('MMMM D, YYYY')}
                name={r.friendName}
                description={r.description}
                amount={numeral(r.amount).format('$0,0.00')}
                username={r.friendUsername}
                status={r.status}
                />
              ))
            }
            </div>
          }
        </div>

    </section>
  )
}