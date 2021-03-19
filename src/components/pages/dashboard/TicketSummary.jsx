import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'

export default function TicketSummary() {

    const [summary, setSummary] = useState({
        total_pending: 0,
        total_processing: 0,
        total_snoozed: 0,
        total_completed: 0,
    })

    useEffect(() => {
        const source = axios.CancelToken.source();
        const load = async () => {
            const res = await axios.get('support/ticket-summary/2', { cancelToken: source.token })
            setSummary(res.data.response)
        }
        load()
        return () => {
            source.cancel()
        }
    }, [])

    return (
        <>
            <Row>
                <Col className="mb-2">
                    <h3>Ticket Summary</h3>
                </Col>
            </Row>
            <Row>
                <div className="col-xl-3 col-sm-6 col-12">
                    <Card className="shadow">
                        <Card.Body>
                            <div className="media d-flex">
                                <div className="align-self-center">
                                    <i className="fas fa-child float-left"></i>
                                </div>
                                <div className="media-body text-right">
                                    <h3>{summary.total_pending}</h3>
                                    <span>Pending Tickets</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-xl-3 col-sm-6 col-12">
                    <Card className="shadow">
                        <Card.Body>
                            <div className="media d-flex">
                                <div className="align-self-center">
                                    <i className="fas fa-child float-left"></i>
                                </div>
                                <div className="media-body text-right">
                                    <h3>{summary.total_processing}</h3>
                                    <span>Processing Tickets</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-xl-3 col-sm-6 col-12">
                    <Card className="shadow">
                        <Card.Body>
                            <div className="media d-flex">
                                <div className="align-self-center">
                                    <i className="fas fa-child float-left"></i>
                                </div>
                                <div className="media-body text-right">
                                    <h3>{summary.total_snoozed}</h3>
                                    <span>Today's Snoozed Tickets</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-xl-3 col-sm-6 col-12">
                    <Card className="shadow">
                        <Card.Body>
                            <div className="media d-flex">
                                <div className="align-self-center">
                                    <i className="fas fa-child float-left"></i>
                                </div>
                                <div className="media-body text-right">
                                    <h3>{summary.total_completed}</h3>
                                    <span>Total Completed Tickets</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </>
    )
}
