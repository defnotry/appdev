import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Row, Col } from 'react-bootstrap';

function Basic({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop }) {
    const [files, setFiles] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg'],
            // 'image/jpg': ['.jpg'],
            // 'image/jpeg': ['.jpeg'],
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            if (!acceptedFiles[0].type.startsWith('image/')) {
                return;
            }

            setFiles(acceptedFiles);
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setBackgroundImage(fileReader.result);
            };
            fileReader.readAsDataURL(acceptedFiles[0]);
            onDrop(acceptedFiles);
        },
    });


    const style = useMemo(() => ({
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }), [isDragActive, isDragAccept, activeStyle, acceptStyle, backgroundImage]);

    const hoveredStyle = useMemo(() => ({
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }), [isDragActive, isDragAccept, activeStyle, acceptStyle, backgroundImage]);

    const iconStyle = useMemo(() => ({
        fontSize: iconSize,
        animation: isDragActive ? 'bounce 0.5s infinite' : 'none'
    }), [iconSize, isDragActive]);

    return (
        <Row {...getRootProps({ className: 'dropzone custom-dropzone vh-20', style: isHovered ? hoveredStyle : style })} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <input {...getInputProps()} />
            <Col className='d-flex justify-content-center align-items-center h-100 flex-column'>
                {
                    backgroundImage ? (
                        <>
                            {isHovered ?
                                (
                                    <Row className='d-flex justify-content-center position-relative align-items-center'>
                                        <i className={iconClass} style={iconStyle} aria-hidden="true" />
                                        Change Album Photo
                                    </Row>
                                ) :
                                (
                                    <Row className='h-100 position-relative'>
                                    </Row>
                                )}
                        </>
                    ) : (
                        <>
                            <Row>
                                <i className={iconClass} style={iconStyle} aria-hidden="true" />
                            </Row>
                            <Row className={uploadTextClass}>
                                {uploadText}
                            </Row>
                        </>
                    )
                }

            </Col>
        </Row>
    );
}

const AlbumCoverDropzone = ({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop }) => (
    <Basic uploadText={uploadText} uploadTextClass={uploadTextClass} iconClass={iconClass} iconSize={iconSize} activeStyle={activeStyle} acceptStyle={acceptStyle} onDrop={onDrop} />
);

export default AlbumCoverDropzone;