import React, { useState, useContext, useEffect } from 'react'
import Main from '../../layouts/dashborad/Main';
import ProtectedPage from '../../layouts/ProtectedPage';
import TicketTable from './TicketTable';
import { Row, Col, Button } from 'react-bootstrap';
import AlertLoading from '../../layouts/AlertLoading';
import Define from '../../../utils/helpers/Define';
import { DispatchContext, StateContext } from '../../../utils/context/MainContext';
import ListAction from '../../../utils/context/actions/ListAction';
import CUser from '../../../utils/helpers/CUser';
import { useHistory } from 'react-router-dom';
import URL from './../../../utils/helpers/URL';

export default function TicketList({ match }) {
    const history = useHistory()
    //local state
    const [page, setPage] = useState(1)

    //global state
    const { ticket_list } = useContext(StateContext)
    const { ticket_listDispatch } = useContext(DispatchContext)

    //pagination handle
    const prev = () => {
        if (page > 1) {
            setPage(page => page - 1)
        } else {
            alert("no prev")
        }
    }
    const next = () => {
        if (ticket_list.length < Define.TICKET_PAGE_SIZE) {
            //next page not availble
            alert("no next")
        } else {
            setPage(page => page + 1)
        }
    }


    //load data
    useEffect(() => {
        const listAction = new ListAction(ticket_listDispatch)
        const token = listAction.getSource()

        const load = async () => {
            try {
                if (match.params.type === Define.TICKET_PENDING) {
                    await listAction.getAll(`support/get/ticket/ticket_state/${match.params.type}/${page}`)
                } else {
                    if (CUser.getCurrentuser()) {
                        const uid = CUser.getCurrentuser().id
                        const res = await listAction.getAll(`support/get/ticket/ticket_state/${match.params.type}/assigned_user_id/${uid}/${page}`)
                        //console.log("logging=", res)
                    } else {
                        history.push(URL.TICKET_LIST + "/" + Define.TICKET_PENDING)
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
        load()
        //console.log("ticketlist useeffect")
        //clean up
        return () => {
            token.cancel()
        }

    }, [ticket_list.length, match.params.type])

    return (
        <ProtectedPage>
            {/* //TicketList-> ticketmodel-> MyModel */}
            {/* //TicketList-> TicketTable */}
            <Main title={`Ticket List-${match.params.type}`}>
                <Row >
                    <Col className="d-flex justify-content-center mb-3">
                        <AlertLoading loadColor={Define.BT_DANGER} />
                    </Col>
                </Row>
                <Row >
                    <Col className="d-flex justify-content-start mb-3">
                        <Button className="mr-2" onClick={prev}>Prev</Button>
                        <Button className="mr-2" disabled>{page}</Button>
                        <Button className="mr-2" onClick={next}>Next</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TicketTable type={match.params.type} ticket_list={ticket_list} />
                    </Col>
                </Row>
            </Main>
        </ProtectedPage >
    )
}
