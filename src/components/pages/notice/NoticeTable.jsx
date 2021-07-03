import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Define from "./../../../utils/helpers/Define";
import NoticeDelete from "./NoticeDelete";
import NoticeUpdate from "./NoticeUpdate";
import NoticeView from "./NoticeView";
import AppAction from "./../../../utils/context/actions/AppAction";
import ListAction from "./../../../utils/context/actions/ListAction";
import { DispatchContext, StateContext } from "./../../../utils/context/MainContext";
import Response from "./../../../utils/helpers/Response";
import Helper from "../../../utils/helpers/Helper";
import CUser from "../../../utils/helpers/CUser";

export default function NoticeTable({ page }) {
  const [show, setShow] = useState({ view: false, edit: false, delete: false });
  const [viewItem, setViewItem] = useState(null);

  // Handle View
  const handleClickView = (event) => {
    setShow((pState) => ({ ...pState, view: true }));
    setViewItem(event);
  };
  // Handle Edit
  const handleClickEdit = (event) => {
    setShow((pState) => ({ ...pState, edit: true }));
    setViewItem(event);
  };
  // Handle DeleteTodo
  const handleClickDelete = (event) => {
    setShow((pState) => ({ ...pState, delete: true }));
    setViewItem(event);
  };

  const { appDispatch, notice_listDispatch } = useContext(DispatchContext);

  const onSubmit = async () => {
    //hide the modal
    setShow(false);
    //validation
    const appAction = new AppAction(appDispatch);
    if (!Helper.validateField(viewItem.title, viewItem.description)) {
      appAction.SET_RESPONSE(
        Response(false, "Enter all filed", "", Define.BT_DANGER, {})
      );
      return;
    }
    //call api
    const listAction = new ListAction(notice_listDispatch);
    const res = await listAction.updateData(`notice/${viewItem.id}`, viewItem, "id");
    appAction.SET_RESPONSE(res);
  };

  //global state
  const { notice_list } = useContext(StateContext);

  // Getting Notice_list
  useEffect(() => {

    const listAction = new ListAction(notice_listDispatch)
    const token = listAction.getSource()
    try {
      const uid = CUser.getCurrentuser() && CUser.getCurrentuser().id
      const load = async () => {
        try {
          if (uid) {
            const res = await listAction.getAll(`notice/get-all/${page}`)
            console.log("notice list: ", res)
          }
        } catch (e) {
          console.log(e);
        }
      }
      load()
    } catch (e) {
      console.log(e)
    }

    //clean up
    return () => {
      token.cancel()
    }

  }, [page, notice_list.length])

  return (
    <div>
      {viewItem ? (
        <NoticeView show={show.view} setShow={setShow} viewItem={viewItem} />
      ) : (
        <></>
      )}
      {viewItem ? (
        <NoticeUpdate show={show.edit} setShow={setShow} setViewItem={setViewItem} onSubmit={onSubmit} viewItem={viewItem} />
      ) : (
        <></>
      )}
      {viewItem ? (
        <NoticeDelete
          show={show.delete}
          setShow={setShow}
          viewItem={viewItem}
        />
      ) : (
        <></>
      )}
      {notice_list.length > 0 ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID#</th>
                <th>Notice Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {notice_list.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>
                      {moment(item.created_at).format(Define.FORMAT_DATE)}
                    </td>
                    <td>
                      <button
                        className="btn text-info"
                        onClick={() => handleClickView(item)}
                      >
                        View
                      </button>
                      <button
                        className="btn text-info"
                        onClick={() => handleClickEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn text-info"
                        onClick={() => handleClickDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : (
        <div>
          <h3 className="text-center">No Notice Found</h3>
        </div>
      )}
    </div>
  );
}
