import '../../css/dataTables.css'
import '../../css/index.css';
import React, { Component, useEffect, useRef } from "react";
import { Container, Row, Col, Table, Form } from 'react-bootstrap';


export function SongsTable(props) {
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
                lengthChange: false,
                columns: [
                    { data: 'id', title: "ID" },
                    { data: 'display_name', title: "Title" },
                    {
                        data: 'user',
                        title: "Artist",
                        render: function (data, type, row) {
                            return data ? data.name : '';
                        }
                    },
                    {
                        title: "Action",
                        data: null,
                        defaultContent: "<button class='view-button'>View</button> <button class='edit-button'>Edit</button> <button class='deactivate-button'>Deactivate</button> <button class='delete-button'>Delete</button>",
                        orderable: false
                    }
                ],
                // rowCallback: function (row, data, index) {
                //     $(row).addClass('clickable-row').on('click', function () {
                //         console.log('Row clicked:', data);
                //     });
                // }
                destroy: true,
            });

        $table.on('click', 'button.view-button', function () {
            const data = table.row($(this).parents('tr')).data();
        });

        $table.on('click', 'button.edit-button', function () {
            const data = table.row($(this).parents('tr')).data();
            console.log(data);
        });

        $table.on('click', 'button.deactivate-button', function () {
            const data = table.row($(this).parents('tr')).data();
            console.log(data);
        });

        $table.on('click', 'button.delete-button', function () {
            const data = table.row($(this).parents('tr')).data();
            console.log(data);
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