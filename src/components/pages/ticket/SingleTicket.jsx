import React, { useContext, useState, useEffect } from 'react'
import Main from '../../layouts/dashborad/Main'
import ProtectedPage from '../../layouts/ProtectedPage'

import '../../../assets/css/chat.css'

import ListAction from './../../../utils/context/actions/ListAction';
import { DispatchContext, StateContext } from './../../../utils/context/MainContext';
import CUser from './../../../utils/helpers/CUser';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import URL from '../../../utils/helpers/URL';
import Define from './../../../utils/helpers/Define';
import Select from '../../layouts/form/Select';
import AlertLoading from '../../layouts/AlertLoading';
import AppAction from './../../../utils/context/actions/AppAction';
import Response from './../../../utils/helpers/Response';
import { Button, Card, Container, Row } from 'react-bootstrap';
import MyModal from '../../layouts/modal/MyModal';
import Input from '../../layouts/form/Input';
import moment from 'moment';


export default function SingleTicket({ match }) {
    const { chats } = useContext(StateContext)
    const { chatsDispatch, appDispatch } = useContext(DispatchContext)
    //params
    const { type, id } = match.params

    //local state
    const [ticket, setTicket] = useState({})
    const [student, setStudent] = useState({})
    const [aos, setAos] = useState([])
    const [ao_id, setAo_id] = useState(CUser.getCurrentuser() && CUser.getCurrentuser().id)
    const [message, setMessage] = useState("")
    let initSnoozed = {
        ticket_state: Define.TICKET_SNOOZED,
        reschedule_reason: "",
        reschedule_date: ""
    }
    const [snoozedObj, setSnoozedObj] = useState(initSnoozed)
    const [show, setShow] = useState(false)

    const history = useHistory()

    //load chat list
    useEffect(() => {
        const listAction = new ListAction(chatsDispatch)
        const token = listAction.getSource()
        const load = async () => {
            try {
                //load the ticket first
                const ticketRes = await axios.get(`support/get-one/ticket/id/${id}/`)
                const ticketObj = ticketRes.data
                //console.log(ticketObj)
                if (!ticketObj.error) {
                    setTicket(ticketObj.response)
                    if (type === Define.TICKET_PENDING) {
                        const aores = await axios.get(`data/get-all/ao/id/`)
                        //console.log(aores.data.response)
                        setAos(aores.data.response)
                    }
                    //load student info
                    const studentRes = await axios.get(`support/get-one/students/student_id/${ticketObj.response.student_id}/`)
                    const studentObj = studentRes.data
                    console.log("here it is: ", studentObj.response)
                    setStudent(studentObj.response)
                    //if valid then load chats
                    const res = await listAction.getAll(`support/get/ticket_chat/ticket_id/${id}/`)
                    //console.log(res, chats);
                } else {
                    history.push(URL.TICKET_LIST + "/" + Define.TICKET_PENDING)
                }
            } catch (e) {
                console.log(e)
                history.push(URL.TICKET_LIST + "/" + Define.TICKET_PENDING)
            }
        }
        load()
        //console.log("singleticket useeffect")

        //clean up
        return () => {
            token.cancel()
        }

    }, [chats.length])//chats.length

    //add new chat
    const addNew = async () => {

        if (!message && message === "") {
            return
        }

        const chatObj = {
            sender_id: CUser.getCurrentuser() && CUser.getCurrentuser().id,
            message: message,
            ticket_id: id
        }


        const listAction = new ListAction(chatsDispatch)
        const res = await listAction.addData('support/create-message', chatObj)
        setMessage("")
        //scroll down
        // window.scrollTo(0, document.querySelector(".chats").scrollHeight);
        //console.log(res)

    }

    const assignAO = () => {
        //assign and start processing
        const Obj = {
            assigned_user_id: ao_id
        }
        updateTicekt(Obj)
    }

    const MarkComplete = () => {
        const confirm = window.confirm("Are You Sure to mark it complete?")
        if (confirm) {
            const Obj = {
                ticket_state: Define.TICKET_COMPLETED
            }
            updateTicekt(Obj)
        }
    }

    const onChnangeSn = (e) => {
        setSnoozedObj({ ...snoozedObj, [e.target.name]: e.target.value })
    }
    const MarkSnooze = () => {
        //show modal
        const confirm = window.confirm("Are You Sure to snoozed?")
        if (confirm) {
            console.log(snoozedObj)
            updateTicekt(snoozedObj)
            setShow(false)
        }
    }

    const sendToProcess = () => {
        const confirm = window.confirm("Are You Sure to send it processing state?")
        if (confirm) {
            const Obj = {
                ticket_state: Define.TICKET_PROCESSING
            }
            updateTicekt(Obj)
        }
    }

    const updateTicekt = async (Obj) => {
        const appload = new AppAction(appDispatch)
        appload.START_LOADING()
        try {
            const res = await axios.put(`support/update-ticket/${id}`, Obj)
            console.log(res);
            appload.SET_RESPONSE(Response(true, res.data.message, "", Define.BT_SUCCESS, {}))
            appload.STOP_LOADING()
        } catch (e) {
            console.log(e)
            appload.SET_RESPONSE(Response(true, e.message, "", Define.BT_DANGER, {}))
            appload.STOP_LOADING()
        }
    }

    return (
        <>
            <ProtectedPage>
                <Main title={`Ticket No- ${id} (${type})`}>
                    <MyModal title="Make Ticket Snoozed" show={show} setShow={setShow} onSubmit={MarkSnooze}>
                        <form>
                            <Input title="Enter Reschedule/Snoozed Reason" name="reschedule_reason" value={snoozedObj.reschedule_reason} type="textarea" onChange={onChnangeSn} />
                            <Input title="Enter Reschedule Date" name="reschedule_date" value={snoozedObj.reschedule_date} type="date" onChange={onChnangeSn} />
                        </form>
                    </MyModal>
                    <div className="col-md-12 col-xs-12">
                        {/* <!-- Panel Chat --> */}
                        <div className="panel" id="chat">
                            <div className="panel-heading">
                                <div className="d-flex justify-content-between">
                                    <h4 className="panel-title text-primary">
                                        Ticket Title: {ticket.ticket_title}
                                    </h4>
                                    {type === Define.TICKET_PROCESSING ?
                                        <div>
                                            <Button onClick={() => { setShow(true) }} className="shadow shadow-lg">
                                                Make Snooze
                                            </Button>
                                            <Button onClick={MarkComplete} className="shadow shadow-lg ml-2">
                                                Mark As Complete
                                            </Button>
                                        </div> : ""}
                                    {(type === Define.TICKET_SNOOZED || type === Define.TICKET_COMPLETED) ?
                                        <div>
                                            <Button onClick={sendToProcess} className="shadow shadow-lg">
                                                Send To Processing
                                            </Button>
                                        </div> : ""}

                                </div>

                                <AlertLoading loadColor={Define.BT_INFO} />
                            </div>


                            <Container>
                                <Row>
                                    <div className="col-md-9 col-xs-12">
                                        <div className="panel-body">
                                            <div className="chats height-overflow-y" >
                                                {chats.length > 0 && [].concat(chats).reverse().map(chat => {
                                                    //
                                                    // { console.log(chat.sender_id, "=", (CUser.getCurrentuser() && CUser.getCurrentuser().id.toString())) }
                                                    const classV = (chat.sender_id === (CUser.getCurrentuser() && CUser.getCurrentuser().id.toString())) ? "chat" : "chat chat-left"

                                                    return <div key={chat.id} className={classV}>
                                                        <div className="chat-avatar">
                                                            <a className="avatar avatar-online" data-toggle="tooltip" href="#" data-placement="left" title="" data-original-title="Edward Fletcher">
                                                                {/* <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" /> */}
                                                                <i className="fas fa-user-circle text-primary " style={{ fontSize: '32px' }}></i>
                                                            </a>
                                                        </div>
                                                        <div className="chat-body">
                                                            <div className="chat-content">
                                                                <p>{chat.message}</p>
                                                                <time className="chat-time" dateTime={chat.created_at}>{chat.created_at}</time>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })}

                                            </div>
                                        </div>

                                        <div className="panel-footer">
                                            <>

                                                {type === Define.TICKET_PENDING ?
                                                    <div className="">
                                                        <Select title="Select AO" options={aos} value={ao_id} setValue={setAo_id} />
                                                        <span className="input-group-btn">
                                                            <button onClick={assignAO} className="btn btn-primary " type="button">Assign Now</button>
                                                        </span>
                                                    </div>
                                                    :
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write Message..." disabled={type === Define.TICKET_PROCESSING ? false : true} />
                                                        <span className="input-group-btn">
                                                            <button onClick={addNew} className="btn btn-primary ml-2" type="button">Send</button>
                                                        </span>
                                                    </div>}


                                            </>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-xs-12">
                                        {type === Define.TICKET_SNOOZED && <Card className="mb-3" style={{ width: '100%' }}>
                                            <Card.Body>
                                                <Card.Text>
                                                    <b>Snoozed Reason</b>: {ticket.reschedule_reason}<br />
                                                    <b>Snoozed Date</b>: {moment(ticket.reschedule_date).format(Define.FORMAT_DATE)}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>}
                                        <Card className="shadow" style={{ width: '100%' }}>
                                            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                            <i style={{ fontSize: '50px', textAlign: "center" }} className="mt-5 fas fa-user-circle text-primary"></i>
                                            <Card.Body>
                                                <Card.Title>ID: {student.student_id}</Card.Title>
                                                <Card.Text>
                                                    Name: {student.name}<br />
                                                    {student.email}<br />
                                                    Phone : {student.phone}<br />
                                                    Address : {student.present_address}
                                                </Card.Text>
                                                {/* <Button variant="primary">Go somewhere</Button> */}
                                            </Card.Body>
                                        </Card>

                                    </div>
                                </Row>
                            </Container>
                        </div>
                        {/* <!-- End Panel Chat --> */}
                    </div>

                </Main>
            </ProtectedPage>
        </>
    )
}
