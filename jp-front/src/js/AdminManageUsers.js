import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { UsersTable } from './tables/UsersTable';
import { Breadcrumbs } from "./components/Breadcrumbs";
import axios from "axios";
import Sidebar from './AdminSidebar';
import '../css/index.css';
import BACKEND_URL from "../config";



const AdminManageUsers = () => {

    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/users`);
            setUsers(response.data);
            console.log("ran");
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        // const intervalId = setInterval(() => {
        // }, 2500);
        // return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className="d-flex vh-100 justify-content-center align-items-center">

                <Sidebar />
                <Container className='manage-users align-self-start'>
                    <Row xs={1}>
                        <Col>
                            <Breadcrumbs />

                            <h1 className="text-white heading">User Management</h1>
                            <div className="row">
                                <div className="col">
                                    <div className="container-md p-3 my-2 bg-danger text card">
                                        <h1 className="sub-heading">Admin</h1>
                                        <p className="text-dark">3</p>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="container-md p-3 my-2 bg-danger text card">
                                        <h1 className="sub-heading">Listeners</h1>
                                        <p className="text-dark">9,800,567</p>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="container-md p-3 my-2 bg-danger text card">
                                        <h1 className="sub-heading">Artists</h1>
                                        <p className="text-dark">9,800,567</p>
                                    </div>
                                </div>
                            </div>


                            <div className="col">
                                <NavLink to="/admin/manage-users" className="col-link">All Users</NavLink>
                                <NavLink to="/admin/pending-requests" className="col-link">Pending Requests</NavLink>
                                <NavLink to="/admin/banned" className="col-link">Banned Lists</NavLink>
                            </div>
                            <UsersTable data={users} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default AdminManageUsers;
