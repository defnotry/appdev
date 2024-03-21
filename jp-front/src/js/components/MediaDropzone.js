import React, { useMemo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Row, Col, Button, FormControl } from 'react-bootstrap';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Select from 'react-select';
import BACKEND_URL from "../../config";
import axios from 'axios';



function Basic({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop, onGenreChange}) {
    const [files, setFiles] = useState([]);
    const [editing, setEditing] = useState(null);
    const [fileName, setFileName] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState({});

    useEffect(() => {
        axios.get(`${BACKEND_URL}/genres`)
            .then(response => {
                const genres = response.data;
                const options = genres.map(genre => ({ value: genre.id, label: genre.name }));
                setOptions(options);
            });
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
        accept: {
            'audio/mp3': ['.mp3'],
        },
        onDrop: acceptedFiles => {
            setFiles(prev => [...prev, ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: (file.size / 1048576).toFixed(2),
                displayName: file.name.split('.').slice(0, -1).join('.')  // Add display name
            }))]);
            onDrop(acceptedFiles);
        }
    });

    const removeFile = file => (event) => {
        event.stopPropagation();
        const newFiles = [...files];
        newFiles.splice(newFiles.indexOf(file), 1);
        setFiles(newFiles);
    };

    const handleDoubleClick = (file, index) => {
        setEditing(index);
        setFileName(file.displayName);  // Edit display name
    };

    const handleFileNameChange = (event) => {
        setFileName(event.target.value);
    };

    const handleBlur = (file) => {
        file.displayName = fileName;  // Update display name
        setFiles([...files]);
        setEditing(null);
    };

    const handleKeyDown = (event, file, index) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleBlur(file, index);
        }
    };

    const handleGenreChange = (file) => (selectedOptions) => {
        setSelectedGenres(prev => {
            const newGenres = { ...prev, [file.path]: selectedOptions };
            onGenreChange(newGenres); 
            return newGenres;
        });
    };

    const filesView = files.map((file, index) => (
        <React.Fragment key={`${file.path}-${index}`}>
            <Row className="mb-2 files-view" onClick={(e) => e.stopPropagation()}>
                <Col className='d-flex flex-column justify-content-start'>
                    <Row className='d-flex flex-nowrap'>
                        <Col xs={5} className='d-flex justify-content-start align-items-center'>
                            {editing === index ? (
                                <FormControl
                                    value={fileName}
                                    onChange={handleFileNameChange}
                                    onBlur={() => handleBlur(file, index)}
                                    onKeyDown={(event) => handleKeyDown(event, file, index)}
                                />
                            ) : (
                                <h5 className='upload-preview' onDoubleClick={() => handleDoubleClick(file, index)}>{file.displayName}</h5>
                            )}
                        </Col>
                        <Col xs={4} className='d-flex align-items-center' >
                            <Select
                                isMulti
                                options={options}
                                placeholder='Genre'
                                value={selectedGenres[file.path]}
                                onChange={handleGenreChange(file)}
                            />
                            {/* <Select isMulti options={options} placeholder='Genre' className='d-flex overflow-auto' /> */}
                        </Col>
                        <Col className='d-flex justify-content-start align-items-center'>
                            {file.formattedSize} MB
                        </Col>
                        <Col>
                            <Button className='fa fa-times p-2 btn-preview-delete' variant='danger' onClick={removeFile(file)} />
                        </Col>
                    </Row>
                    <Row>
                        <AudioPlayer src={file.preview} layout="horizontal" className='player-borderless' />
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
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
        <Container>
            <Row {...getRootProps({ className: 'dropzone media-dropzone vh-20', style })}>
                <input {...getInputProps()} />
                {files.length === 0 ? (
                    <Col className='d-flex align-items-center justify-content-center p-5 flex-column'>
                        <Row>
                            <i className={iconClass} style={iconStyle} aria-hidden="true" />
                            <Row className={uploadTextClass}>
                                {uploadText}
                            </Row>
                        </Row>
                    </Col>
                ) : (
                    <Col className='p-3'>
                        <Row className='justify-content-center align-items-center d-flex flex-grow-1'>
                            {filesView}
                        </Row>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

const MediaDropzone = ({ uploadText, uploadTextClass, iconClass, iconSize, activeStyle, acceptStyle, onDrop, onGenreChange }) => (
    <Basic uploadText={uploadText} uploadTextClass={uploadTextClass} iconClass={iconClass} iconSize={iconSize} activeStyle={activeStyle} acceptStyle={acceptStyle} onDrop={onDrop} onGenreChange={onGenreChange} />
);

export default MediaDropzone;