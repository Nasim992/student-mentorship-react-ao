import React, { useState } from 'react'
import Main from '../../layouts/dashborad/Main';
import ProtectedPage from '../../layouts/ProtectedPage';
import { Row, Col, Button } from 'react-bootstrap';
import AlertLoading from '../../layouts/AlertLoading';
import Define from '../../../utils/helpers/Define';
import CUser from '../../../utils/helpers/CUser';
import Input from './../../layouts/form/Input';
import axios from 'axios';
import SearchTable from './SearchTable';

export default function SearchTicket() {

    //local state
    const [text, setText] = useState("")
    const [list, setList] = useState([])


    const searchNow = async (event) => {
        event.preventDefault()
        if (text.length > 2) {
            try {
                const res = await axios.get(`support/search/${text}/${CUser.getCurrentuser() && CUser.getCurrentuser().id}`)
                setList(res.data.response)
                console.log(res.data.response)
            } catch (e) {
                console.log(e)
            }
        }
    }


    return (
        <ProtectedPage>
            <Main title={`Search Result For-${text}`}>
                <Row >
                    <Col className="d-flex justify-content-center mb-3">
                        <AlertLoading loadColor={Define.BT_DANGER} />
                    </Col>
                </Row>
                <Row className="align-items-center" >
                    <Col md={8} xs={12} className="mb-3">
                        <Input value={text} label={false}
                            onChange={(e) => setText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" ? searchNow(e) : null}
                            title="Search Ticket by Student ID e.g. 17303024" />
                    </Col>
                    <Col md={4} xs={12} className="mb-3">
                        <Button className="mr-2 mb-3 w-100" onClick={searchNow}>Search Now</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <SearchTable ticket_list={list} />
                    </Col>
                </Row>
            </Main>
        </ProtectedPage >
    )
}
