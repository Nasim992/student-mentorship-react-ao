import React from 'react'
import { Form } from 'react-bootstrap';

/**
 * 
 * @param {options} [{id:"",name:""}]
 * @returns <Select title="" value="" setValue="" options={[]}/>
 */

export default function Select({ title, value, setValue, options }) {
    const change = (e) => {
        setValue(e.target.value);
    }
    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>{title}</Form.Label>
                    <Form.Control as="select" value={value} onChange={change} custom>
                        {options.map(i => {
                            return <option key={i.id} value={i.id}>{i.name}</option>
                        })}
                    </Form.Control>
                </Form.Group>
            </Form>
        </>
    )
}
