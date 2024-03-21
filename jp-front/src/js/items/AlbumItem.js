import { Row, Col, Image, Form } from 'react-bootstrap';

const AlbumItem = ({ album }) => (
    <Row className="p-2 album-item">
        <Col className="justify-content-center d-flex align-items-center" xs={1}>
            <Form.Check />
        </Col>
        <Col>
            <Image
                src={`http://127.0.0.1/storage/album_images/${album.cover_photo_hash}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '2%' }}
            />
        </Col>
        <Col className="d-flex align-items-center justify-content-start">
            <a href=''>
                {album.album_name}
            </a>
        </Col>
        <Col xs={3} className='d-flex align-items-center'>
            <p className='album-item-description'>
                {album.album_description}
            </p>
        </Col>
        <Col className="d-flex align-items-center">
            {
                new Date(album.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }
        </Col>
        <Col className="d-flex align-items-center">
            {album.is_published ? "Published" : "Draft"}
        </Col>
        <Col className="d-flex align-items-center">
            {Math.floor(Math.random() * 1000)} {/* Random number between 0 and 999 */}
        </Col>
        <Col className="d-flex align-items-center">
            {Math.floor(Math.random() * 2000)} {/* Random number between 0 and 1999 */}
        </Col>
    </Row>
);

export default AlbumItem;