import React from 'react';
import { Col, Row, Image } from 'react-bootstrap';

const ArtistItem = ({ onClick, name }) => {
        return (
            <Col onClick={onClick} xs={2} className="artist-item">
                <Row className='mb-3'>
                    <Image src="https://via.placeholder.com/150" roundedCircle />
                </Row>
                <Row>
                    <p>{name}</p>
                </Row>
            </Col>
        );
    }

export default ArtistItem;