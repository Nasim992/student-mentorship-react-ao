import React from "react";
import Input from "../../layouts/form/Input";
import ModalUpdate from "../../layouts/modal/ModalUpdate";
import '../../../assets/css/dashboard.css';

export default function NoticeUpdate({ show, setShow,viewItem,setViewItem,onSubmit }) {

  const onChange = (e) => {
    setViewItem({ ...viewItem, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <ModalUpdate
        title="Edit Notice"
        show={show}
        setShow={setShow}
        onSubmit={()=>onSubmit()}
      >
        <Input
          name="title"
          title="Notice Title"
          value={viewItem.title}
          onChange={onChange}
        />
        <Input
          name="description"
          type="textarea"
          title="Description(If Any):"
          value={viewItem.description}
          onChange={onChange}
        />
      </ModalUpdate>
    </div>
  );
}
