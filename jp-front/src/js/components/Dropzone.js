import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col } from 'react-bootstrap';

function Basic({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle }) {
    const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone();

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const style = useMemo(() => ({
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
    }), [isDragActive, isDragAccept, activeStyle, acceptStyle]);

    const iconStyle = useMemo(() => ({
        fontSize: iconSize,
        animation: isDragActive ? 'bounce 0.5s infinite' : 'none'
    }), [iconSize, isDragActive]);

    return (
        <Container fluid>
            <Row {...getRootProps({ className: 'dropzone custom-dropzone vh-20', style })}>
                <input {...getInputProps()} />
                <Col className='d-flex justify-content-center align-items-center p-5 flex-column'>
                    <Row>
                        <i className={iconClass} style={iconStyle} aria-hidden="true" />
                    </Row>
                    <Row className={uploadTextClass}>
                        {uploadText}
                    </Row>
                </Col>
            </Row>
            {/* <Row>
                <h4>Files</h4>
                <ul>{files}</ul>
            </Row> */}
        </Container>
    );
}

const Dropzone = ({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle }) => (
    <Basic uploadText={uploadText} uploadTextClass={uploadTextClass} iconClass={iconClass} iconSize={iconSize} activeStyle={activeStyle} acceptStyle={acceptStyle} />
);

export default Dropzone;