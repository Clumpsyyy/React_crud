import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";   
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import CloseButton from "react-bootstrap/CloseButton";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons';


const Position = ({userId}) => {

    const response = JSON.parse(localStorage.getItem('token'))

    const [position, setPosition] = useState([])

    const headers = {
        // accept: 'application/json',
        Authorization: 'bearer ' + response.data.authorisation.token,
        'Content-Type': 'application/json'
    }

    useEffect(()=>{
        fetchPosition()
    },[])

    const fetchPosition = async () => {
        await axios.get('https://mywebsite.x10.mx/api/positions', {headers:headers}, {
            headers: headers
        }).then(({data})=>{
            setPosition(data)
        })
    }

    //Modal Initialization
    const [modalState, setModalState] = useState("close");

    const handleClose = () => {
        setModalState("close")
    }

    //Read Position
    const [read_id, setReadID] = useState("")
    const [read_position_code, setReadPositionCode] = useState("")
    const [read_position_name, setReadPositionName] = useState("")

    const readPosition = async (id, position_code, position_name) => {

        setReadID(id)
        setReadPositionCode(position_code)
        setReadPositionName(position_name)

        // console.log(id);
        // console.log(position_code);
        // console.log(position_name);

        setModalState("modal-read-position")
    }

    //Delete Position
    const deletePosition = async (id) => {

        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: 'blue',
            cancelButtonColor: 'red',
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            return result.isConfirmed
        });

        if(!isConfirm){
            return;
        }

        await axios.delete(`https://mywebsite.x10.mx/api/positions/${id}`,{headers: headers}).then(({data})=>{
            Swal.fire({
                title: "Successfully Deleted!",
                icon: "success",
                text:data.message
            })
            fetchPosition()
        }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
        })
    }

// Create Position
const handleShowModalCreateUser = async () => {
    setModalState("modal-create-position");
    setPositionCode('');
    setPositionName('');
    setUserID(userId);

    try {
        const response = await axios.get('https://mywebsite.x10.mx/api/elections', {
            headers: headers
        });

        setElections(response.data);

        if (response.data.length > 0) {
            setElectionID(response.data[0].id);
        } else {
            setElectionID('');
        }
    } catch (error) {
        console.error('Error fetching elections:', error);
        // Handle error fetching elections
    }
}

const [elections, setElections] = useState([]);
const [position_code, setPositionCode] = useState("");
const [position_name, setPositionName] = useState("");
const [user_id, setUserID] = useState("");
const [election_id, setElectionID] = useState("");
const [validationError, setValidationError] = useState({});

const createPosition = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('position_code', position_code);
    formData.append('position_name', position_name);
    formData.append('user_id', userId);
    formData.append('election_id', election_id);

    try {
        const response = await axios.post(`https://mywebsite.x10.mx/api/positions`, formData, {
            headers: headers
        });

        Swal.fire({
            title: "Successfully inserted!",
            icon: "success",
            text: response.data.message
        });

        fetchPosition();
        setPositionCode('');
        setPositionName('');
        setUserID('');
        setElectionID('');
    } catch (error) {
        if (error.response && error.response.status === 422) {
            setValidationError(error.response.data.errors);
        } else {
            Swal.fire({
                text: error.response ? error.response.data.message : 'Error creating position',
                icon: 'error'
            });
        }
    }
}


    //Update Position
    const [updated_position_id, setUpdatedPositionID] = useState("")
    const [updated_position_code, setUpdatedPositionCode] = useState("")
    const [updated_position_name, setUpdatedPositionName] = useState("")
    const [updated_user_id, setUpdatedUserID] = useState("")
    const [updated_election_id, setUpdatedElectionID] = useState("")
    const [updateElectionOptions, setUpdateElectionOptions] = useState([]);

    const updatePosition = async (id, position_code, position_name, user, election_id) => {
        setUpdatedPositionID(id)
        setUpdatedPositionCode(position_code)
        setUpdatedPositionName(position_name)
        setUpdatedUserID(userId)
        
        try {
            const response = await axios.get('https://mywebsite.x10.mx/api/elections', {
                headers: headers
            });
    
            setUpdateElectionOptions(response.data);
    
            if (response.data.length > 0) {
                // Find the index of the existing election_id in the options array
                const selectedIndex = response.data.findIndex(election => election.id === election_id);
    
                // Set the options with the existing election_id at the front
                setUpdateElectionOptions([
                    response.data[selectedIndex],
                    ...response.data.slice(0, selectedIndex),
                    ...response.data.slice(selectedIndex + 1)
                ]);
            }
    
            setUpdatedElectionID(election_id);
    
            setModalState("modal-update-position");
        } catch (error) {
            console.error('Error fetching elections:', error);
            // Handle error fetching elections
        }
    };

        //setModalState("modal-update-position")
    

    const updatePositionData = async (e) => {

        e.preventDefault();

        const id = updated_position_id;
        const position_code = updated_position_code;
        const position_name = updated_position_name;
        const user_id = updated_user_id;
        const election_id = updated_election_id;

        // console.log("id: "+id);
        // console.log("code: "+position_code);
        // console.log("name: "+position_name);
        // console.log("user: "+user_id);
        // console.log("election: "+election_id);

        const formData = new FormData()

        //formData.append('id', id)
        formData.append('position_code', position_code)
        formData.append('position_name', position_name)
        formData.append('user_id', user_id)
        formData.append('election_id', election_id)

        await axios.put(`https://mywebsite.x10.mx/api/positions/${id}`, formData, {headers:headers}).then(({data})=>{

        Swal.fire({
            title: "Successfully updated!",
            icon: "success",
            text:data.message
        })
        fetchPosition()
        handleClose()
        }).catch(({response})=>{

            if(response.status===422){
                setValidationError(response.data.errors)
            }
            else{
                Swal.fire({
                    text:read_position_code.data.message,
                    icon: "error"
                })
            }
        })
    }

    return (
        <>
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Position Code</th>
                        <th>Position Name</th>
                        <th>Action <Button variant="success" onClick={handleShowModalCreateUser} size='sm'>Create</Button></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        position.length > 0 && (
                            position.slice(0,10).map((row, key)=>(
                                <tr key={key}>
                                    <td>{row.id}</td>
                                    <td>{row.position_code}</td>
                                    <td>{row.position_name}</td>
                                    <td>
                                    <Button variant="info" onClick={() => readPosition(row.id, row.position_code, row.position_name)} size='sm'>
  <Eye /> {/* Eye icon for Read */}
</Button>
<> </>
<Button variant="warning" onClick={() => updatePosition(row.id, row.position_code, row.position_name, row.user_id, row.election_id)} size='sm'>
  <PencilSquare /> {/* PencilSquare icon for Update */}
</Button>
<> </>
<Button variant="danger" onClick={() => deletePosition(row.id)} size='sm'>
  <Trash /> {/* Trash icon for Delete */}
</Button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </Table>

            {/* <Modal Read User/> */}
            <Modal show={modalState === "modal-read-position"}>
                <Modal.Header>
                    Read User Account <CloseButton onClick={handleClose} className="float-end"/>
                </Modal.Header>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col>
                            <Form.Group controlId="ID">
                                <Form.Label>ID</Form.Label>
                                <Form.Control type="text" value={read_id} disabled={true} onChange={(event)=>{
                                    setReadID(event.target.value)
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <Form.Group controlId="Code">
                                <Form.Label>Position Code</Form.Label>
                                <Form.Control type="text" value={read_position_code} disabled={true} onChange={(event)=>{
                                    setReadPositionCode(event.target.value)
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <Form.Group controlId="Name">
                                <Form.Label>Position Name</Form.Label>
                                <Form.Control type="text" value={read_position_name} disabled={true} onChange={(event)=>{
                                    setReadPositionName(event.target.value)
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
            
            {/* Modal Create Position */}
            <Modal show={modalState === "modal-create-position"}>
                <Modal.Header>
                    Create Position <CloseButton onClick={handleClose} className='float-end'/>
                </Modal.Header>

                <ModalBody>
                    <Form onSubmit={createPosition}>
                        <Row>
                            <Col>
                            <Form.Group controlId='PositionCode'>
                                <Form.Label>Position Code</Form.Label>
                                <Form.Control type="text" value={position_code} required onChange={(event)=>{
                                    setPositionCode(event.target.value)
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <Form.Group controlId='PositionName'>
                                <Form.Label>Position Name</Form.Label>
                                <Form.Control type="text" value={position_name} required onChange={(event)=>{
                                    setPositionName(event.target.value)
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col>
                                <Form.Group controlId='UserID'>
                                    <Form.Label>User ID</Form.Label>
                                    <Form.Control type="text" value={user_id} disabled />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <Form.Group controlId='ElectionID'>
    <Form.Label>Election ID</Form.Label>
    <Form.Control as="select" value={election_id} onChange={(event) => setElectionID(event.target.value)} required>
        <option value="" disabled>Select Election</option>
        {elections.map(election => (
            <option key={election.id} value={election.id}>{election.election_description}</option>
        ))}
    </Form.Control>
</Form.Group>

                            </Col>
                        </Row>

                        <br />
                        <Button variant="primary" className='float-end' size='sm' block="block" type='submit'>Save Position</Button>
                    </Form>
                </ModalBody>
            </Modal>
            
            {/* Modal Update Position */}
            <Modal show={modalState === "modal-update-position"}>
                <Modal.Header>
                    Update Position <CloseButton onClick={handleClose} className='float-end'/>
                </Modal.Header>

                <ModalBody>
                    <Form onSubmit={updatePositionData}>
                        <Row>
                            <Col>
                                <Form.Group controlId='PositionID'>
                                    <Form.Label>Position ID</Form.Label>
                                    <Form.Control type="text" value={updated_position_id} disabled onChange={(event)=>{
                                        setUpdatedPositionID(event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId='PositionCode'>
                                    <Form.Label>Position Code</Form.Label>
                                    <Form.Control type="text" value={updated_position_code} required onChange={(event)=>{
                                        setUpdatedPositionCode(event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId='PositionName'>
                                    <Form.Label>Position Name</Form.Label>
                                    <Form.Control type="text" value={updated_position_name} required onChange={(event)=>{
                                        setUpdatedPositionName(event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId='UserID'>
                                    <Form.Label>User ID</Form.Label>
                                    <Form.Control type="text" value={updated_user_id} disabled onChange={(event)=>{
                                        setUpdatedUserID(event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <Form.Group controlId='ElectionID'>
    <Form.Label>Election ID</Form.Label>
    <Form.Control type="text" value={updated_election_id} required onChange={(event) => {
        setUpdatedElectionID(event.target.value);
    }} />
</Form.Group>
                            </Col>
                        </Row>

                        <br/>
                        <Button variant='primary' className='float-end' size='sm' block="block" type='submit'>Save Position</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
        </>
        
    );
}

export default Position;