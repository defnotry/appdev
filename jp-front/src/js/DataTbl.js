import '../css/dataTables.css'
import '../css/index.css';
import React, { Component, useRef } from "react";
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const $ = require('jquery')
$.DataTable = require('datatables.net')

export class DataTbl extends Component {
    
    componentDidMount() {
        this.createDataTable();
    }

    componentDidUpdate(prevProps) {
        if (this.table && prevProps.data !== this.props.data) {
            this.table.clear();
            this.table.rows.add(this.props.data);
            this.table.draw();
            console.log('DataTbl update');
        }
    }

    componentWillUnmount() {
        this.$el.DataTable().destroy();
    }

    createDataTable() {
        if (!this.table) {
            this.$el = $(this.el);
            this.$el.DataTable({
                data: this.props.data,
                columns: [
                    { data: 'id', title: "ID" },
                    { data: 'name', title: "Username" },
                    { data: 'email', title: "Email" },
                    { data: 'role', title: "Role" },
                    {
                        title: "Status",
                        data: null,
                        render: function (data, type, row) {
                            if (row.is_deactivated) {
                                return '<span style="color: red;">Deactivated</span>';
                            } else {
                                return row.email_verified_at
                                    ? '<span style="color: green;">Normal</span>'
                                    : '<span style="color: orange;">Pending Verification</span>';
                            }
                        }
                    },
                    {
                        title: "Action",
                        data: null,
                        defaultContent: "<button class='alert-button'>Click!</button>",
                        orderable: false
                    }
                ],
                rowCallback: function (row, data, index) {
                    $(row).addClass('clickable-row').on('click', function () {
                        console.log('Row clicked:', data);
                    });
                }
            });
        }


        this.$el.on('click', 'button.alert-button', function () {
            alert('Hello, World');
            console.log('Hello, World');
        });

    }
    render() {
        return <Container className='table-background' fluid>
            <div className='table'>
                <table className='display' width="100%" ref={el => this.el = el}>
                </table>
            </div>
        </Container>
    }
}