import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import '../css/index.css'
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarMenuItem,
    CDBSidebarMenu,
    CDBSidebarHeader
} from 'cdbreact';
import { Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';
import axios from "axios";
import BACKEND_URL from "../config";



const Sidebar = props => {
    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            navigate('/login');
        } else {
            fetchUserDetails();
        }
    }, []);

    const [isVerified, setIsVerified] = useState(false);
    const [logoutDisabled, setLogoutDisabled] = useState(false);
    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.get(`${BACKEND_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userData = response.data; // Assuming user details are directly in response.data
            console.log(userData);
            setIsVerified(userData.email_verified_at !== null);
            // Check if the user has admin or superadmin role
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLogoutDisabled(true);
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.post(
                `${BACKEND_URL}/auth/logout`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            localStorage.removeItem('jwt_token');
            navigate('/login');
        } catch (error) {
            console.error("Login failed:", error);
            setLogoutDisabled(false);
        }
    };

    return (
        <>
            <CDBSidebar textColor="#fff" backgroundColor="#333" className="sidebar">
                <Image
                    src="/register/logo-white.png"
                    roundedCircle
                    className="Register-apple"
                    style={{
                        width: "50px",
                        height: "50px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "10px",
                    }}
                />

                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                        SUPER ADMIN
                    </a>
                </CDBSidebarHeader>
                <Col className="flex-grow-1 d-flex flex-column vh-100" fluid={true}>
                    <Row className="align-items-start">
                        <CDBSidebarContent className="sidebar-content">
                            <CDBSidebarMenu>
                                <nav id="sidebar">
                                    <NavLink exact to="/admin" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="home">Dashboard</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/admin/manage-users" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="user">Manage Users</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/tickets" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="table">Subscription Settings</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/revenue" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="columns">Revenue</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink onClick={handleSubmit} activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="">Logout</CDBSidebarMenuItem>
                                    </NavLink>
                                </nav>
                            </CDBSidebarMenu>
                        </CDBSidebarContent>
                    </Row>
                </Col>
            </CDBSidebar>
        </>
    );
};
export default Sidebar;