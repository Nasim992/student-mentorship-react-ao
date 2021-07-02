import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import NotFound from './../pages/404/index';
import Home from './../pages/dashboard/Home';
import URL from './../../utils/helpers/URL';
import SignUp from '../pages/auth/SignUp';
import SignIn from './../pages/auth/SignIn';
import SingleTicket from './../pages/ticket/SingleTicket';
import TicketList from '../pages/ticket/TicketList';
import Search from './../pages/ticket/Search';
import Contributor from './../pages/contributor/Contributor';
import Notice from "../pages/notice/Notice";


export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={URL.HOME} component={Home} ></Route>
                <Route path={URL.SIGN_UP} component={SignUp}></Route>
                <Route path={URL.SIGN_IN} component={SignIn}></Route>
                <Route exact path={URL.TICKET_LIST + "/:type"} component={TicketList}></Route>
                <Route exact path={URL.TICKET_LIST + "/:type/:id"} component={SingleTicket}></Route>
                <Route exact path={URL.SEARCH_TICKET} component={Search}></Route>
                <Route exact path={URL.CONTRIBUTOR} component={Contributor}></Route>
                <Route exact path={URL.NOTICE_LIST} component={Notice}></Route>
                <Route default component={NotFound}></Route>
            </Switch>
        </BrowserRouter>
    )
}
