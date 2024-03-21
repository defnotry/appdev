import '../../css/dataTables.css'
import '../../css/index.css';
import React, { Component, useEffect, useRef } from "react";
import { Container, Row, Col, Table, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';


export function ArtistRequestTable(props) {
    const $ = require('jquery')
    $.DataTable = require('datatables.net')
    const tableRef = useRef();

    useEffect(() => {
        if (!props.data) {
            return;
        }

        console.log(tableRef.current)
        const $table = $(tableRef.current);
        const table = $(tableRef.current).
            DataTable({
                data: props.data,
                columns: [
                    { data: 'username', title: "Username" },
                    { data: 'email', title: "Email" },
                    {
                        title: "Action",
                        data: null,
                        defaultContent: "<Button class='accept-button'>Accept</Button> <Button class='reject-button'>Reject</Button> <Button class='delete-button'>Reject</Button>",
                        orderable: false
                    }
                ],
                destroy: true,
            });

            $table.on('click', 'button.accept-button', function (event) {
                event.stopPropagation();
                console.log('Accepted');
            });
            $table.on('click', 'button.reject-button', function (event) {
                event.stopPropagation();
                console.log('Rejected');
            });
            $table.on('click', 'button.delete-button', function (event) {
                event.stopPropagation();
                console.log('Deleted');
            });
        
        return function () {
            console.log("Table destroyed")
            table.destroy()
        }
    }, [props.data]);

    return (<Container className='table-background' fluid>
        <div className='table'>
            <table className='display' width="100%" ref={tableRef}>
            </table>
        </div>
    </Container>)
}