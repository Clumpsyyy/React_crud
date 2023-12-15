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
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';


const Candidate = ({userId}) => {

    const response = JSON.parse(localStorage.getItem('token'))

    const [candidate, setCandidate] = useState([])

    const headers = {
        // accept: 'application/json',
        Authorization: 'bearer ' + response.data.authorisation.token,
        'Content-Type': 'application/json'
    }

    useEffect(()=>{
        fetchCandidate()
    },[])

    const fetchCandidate = async () => {
        await axios.get(`https://mywebsite.x10.mx/api/candidates`, {headers:headers}, {
            headers: headers
        }).then(({data})=>{
            setCandidate(data)
        })
    }

    //Modal Initialization
    const [modalState, setModalState] = useState("close");

    const handleClose = () => {
        setModalState("close")
    }

    //Read Candidate
    const [read_id, setReadID] = useState("")
    const [read_first_name, setReadFirstName] = useState("")
    const [read_last_name, setReadLastName] = useState("")

    const readPosition = async (id, first_name, last_name) => {

        setReadID(id)
        setReadFirstName(first_name)
        setReadLastName(last_name)

        // console.log(id);
        // console.log(first_name);
        // console.log(last_name);

        setModalState("modal-read-user")
    }

    //Delete Candidate
    const deleteCandidate = async (id) => {

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

        await axios.delete(`https://mywebsite.x10.mx/api/candidates/${id}`,{headers: headers}).then(({data})=>{
            Swal.fire({
                title: "Successfully Deleted!",
                icon: "success",
                text:data.message
            })
            fetchCandidate()
        }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
        })
    }

    // Create Candidate
const handleShowModalCreateUser = async () => {
    setModalState("modal-create-candidate");
    setFirstName('');
    setLastName('');
    setUserID(userId);

    try {
        const response = await axios.get(`https://mywebsite.x10.mx/api/positions`, {
            headers: headers
        });
        // console.log(response.data); 
        setPositions(response.data);

        if (response.data.length > 0) {
            // Set the default position_id to the first one
            setPositionID(response.data.length > 0 ? response.data[0].position_id : '');
        } else {
            // Clear the position options if there are no positions
            setPositionID('');
        }

    } catch (error) {
        console.error('Error fetching elections:', error);
        // Handle error fetching positions
    }
}

const [positions, setPositions] = useState([]);
const [first_name, setFirstName] = useState("");
const [last_name, setLastName] = useState("");
const [user_id, setUserID] = useState("");
const [position_id, setPositionID] = useState("");
const [validationError, setValidationError] = useState({});

const createCandidate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('user_id', user_id);
    formData.append('position_id', position_id);

    try {
        const response = await axios.post(`https://mywebsite.x10.mx/api/candidates`, formData, {
            headers: headers
        });

        Swal.fire({
            title: "Successfully inserted!",
            icon: "success",
            text: response.data.message
        });

        fetchCandidate();
        setFirstName('');
        setLastName('');
        setUserID('');
        setPositionID('');
    } catch (error) {
        if (error.response && error.response.status === 422) {
            setValidationError(error.response.data.errors);
        } else {
            Swal.fire({
                text: error.response ? error.response.data.message : 'Error creating candidate',
                icon: 'error'
            });
        }
    }
}

    //Update Candidate
    const [updated_candidate_id, setUpdatedCandidateID] = useState("")
    const [updated_first_name, setUpdatedFirstName] = useState("")
    const [updated_last_name, setUpdatedLastName] = useState("")
    const [updated_user_id, setUpdatedUserID] = useState("")
    const [updated_position_id, setUpdatedPositionID] = useState("")

    const updateCandidate = async(id, first_name, last_name, user_id, position_id) => {
        setUpdatedCandidateID(id)
        setUpdatedFirstName(first_name)
        setUpdatedLastName(last_name)
        setUpdatedUserID(userId)
        setUpdatedPositionID(position_id)

        setModalState("modal-update-candidate")
    }

    const updateCandidateData = async (e) => {

        e.preventDefault();

        const id = updated_candidate_id;
        const first_name = updated_first_name;
        const last_name = updated_last_name;
        const user_id = updated_user_id;
        const position_id = updated_position_id;

        const formData = new FormData()

        formData.append('first_name', first_name)
        formData.append('last_name', last_name)
        formData.append('user_id', user_id)
        formData.append('position_id', position_id)

        await axios.put(`https://mywebsite.x10.mx/api/candidates/${id}`, formData, {headers:headers}).then(({data})=>{

        Swal.fire({
            title: "Successfully updated!",
            icon: "success",
            text:data.message
        })
        fetchCandidate()
        handleClose()
        }).catch(({response})=>{

            if(response.status===422){
                setValidationError(response.data.errors)
            }
            else{
                Swal.fire({
                    text:read_first_name.data.message,
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
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Action <Button variant="success" onClick={handleShowModalCreateUser} size='sm'>Create</Button></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        candidate.length > 0 && (
                            candidate.slice(0,10).map((row, key)=>(
                                <tr key={key}>
                                    <td>{row.id}</td>
                                    <td>{row.first_name}</td>
                                    <td>{row.last_name}</td>
                                    <td>
                                    <Button variant="info" onClick={() => readPosition(row.id, row.first_name, row.last_name)} size='sm'><Eye /></Button>{' '}
                                    <Button variant="warning" onClick={() => updateCandidate(row.id, row.first_name, row.last_name, row.user_id, row.position_id)} size='sm'><PencilSquare /></Button>{' '}
                                    <Button variant="danger" onClick={() => deleteCandidate(row.id)} size='sm'><Trash /></Button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </Table>

            {/* <Modal Read User/> */}
            <Modal show={modalState === "modal-read-user"}>
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
                            <Form.Group controlId="Name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={read_first_name} disabled={true} onChange={(event)=>{
                                    setReadFirstName(event.target.value)
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <Form.Group controlId="Email">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" value={read_last_name} disabled={true} onChange={(event)=>{
                                    setReadLastName(event.target.value)
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
            
            {/* Modal Create Candidate */}
            <Modal show={modalState === "modal-create-candidate"}>
                <Modal.Header>
                    Create Candidate <CloseButton onClick={handleClose} className='float-end'/>
                </Modal.Header>

                <ModalBody>
                    <Form onSubmit={createCandidate}>
                        <Row>
                            <Col>
                            <Form.Group controlId='FirstName'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" value={first_name} required onChange={(event)=>{
                                    setFirstName(event.target.value)
                                }}/>
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <Form.Group controlId='LastName'>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" value={last_name} required onChange={(event)=>{
                                    setLastName(event.target.value)
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
                            <Form.Group controlId='PositionID'>
                                <Form.Label>Position ID</Form.Label>
                                <Form.Control as="select" value={position_id} onChange={(event) => setPositionID(event.target.value)} required>
                                    <option value="" disabled>Select Position</option>
                                    {positions.map(position => (
                                        <option key={position.id} value={position.id}>{position.position_name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            </Col>
                        </Row>

                        <br />
                        <Button variant="primary" className='float-end' size='sm' block="block" type='submit'>Save Candidate</Button>
                    </Form>
                </ModalBody>
            </Modal>
            
            {/* Modal Update Candidate */}
            <Modal show={modalState === "modal-update-candidate"}>
                <Modal.Header>
                    Update Candidate <CloseButton onClick={handleClose} className='float-end'/>
                </Modal.Header>

                <ModalBody>
                    <Form onSubmit={updateCandidateData}>
                        <Row>
                            <Col>
                                <Form.Group controlId='CandidateID'>
                                    <Form.Label>Candidate ID</Form.Label>
                                    <Form.Control type="text" value={updated_candidate_id} disabled onChange={(event)=>{
                                        setUpdatedCandidateID(event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId='FirstName'>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" value={updated_first_name} required onChange={(event)=>{
                                        setUpdatedFirstName(event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId='LastName'>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" value={updated_last_name} required onChange={(event)=>{
                                        setUpdatedLastName(event.target.value)
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
                                <Form.Group controlId='PositionID'>
                                    <Form.Label>Position ID</Form.Label>
                                    <Form.Control type="text" value={updated_position_id} required onChange={(event)=>{
                                        setUpdatedPositionID(event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <br/>
                        <Button variant='primary' className='float-end' size='sm' block="block" type='submit'>Save Candidate</Button>
                    </Form>
                </ModalBody>
            </Modal>
            
            </div>
        </>
    );
}

export default Candidate;