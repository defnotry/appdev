import React, { useState } from 'react';
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import '../css/index.css'; // Import CSS file

const Banned = () => {
    const [bannedUsers, setBannedUsers] = useState([
        { id: 1, username: 'john_doe', email: 'john@example.com', reason: 'Inappropriate Videocast' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', reason: 'Inappropriate Podcast' },
        // Add more banned users as needed
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5); // Change this value to adjust the number of users per page

    // Function to handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Calculate index of the last user on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    // Calculate index of the first user on the current page
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    // Get users for the current page
    const currentBannedUsers = bannedUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Function to handle pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Filter users based on search query
    const filteredBannedUsers = bannedUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className='vh-100 d-flex justify-content-center align-items-center'>
                <Sidebar />
                <Container className='manage-users' fluid>
                    <Row>
                        <Col>
                            <h1 className="text-white heading">Banned Users</h1>

                            {/* Search bar */}
                            <Form>
                                <Form.Group controlId="search">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by username, email, or reason"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </Form.Group>
                            </Form>

                            <div className="col">
                                <NavLink to="/admin/manage-users" className="col-link">All Users</NavLink>
                                <NavLink to="/admin/pending-requests" className="col-link">Pending Requests</NavLink>
                                <NavLink to="/admin/banned" className="col-link">Banned Lists</NavLink>
                            </div>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr className='table-danger'>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBannedUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* Pagination */}
                            <nav>
                                <ul className="pagination">
                                    {Array.from({ length: Math.ceil(filteredBannedUsers.length / usersPerPage) }, (_, i) => (
                                        <li key={i} className="page-item">
                                            <button onClick={() => paginate(i + 1)} className="page-link">
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Banned;
