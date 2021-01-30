import { Button, Col, Container, Jumbotron, Row, Form, Alert } from "react-bootstrap";
import { Link, useHistory } from 'react-router-dom';
import { useState, useContext } from 'react';
import { SIGNUP_URL } from './../constants';
import UserContext from './../userContext';

function Signup () {
    const {setUser} = useContext(UserContext);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setlastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const history = useHistory();

    const signup = async (e:any) => {
        e.preventDefault();
        setSubmitting(true);
        let res;
        try{
            res = await fetch(SIGNUP_URL,{
                method: 'post',
                credentials: 'include',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email, password, firstName, lastName
                })
            });


            if(res.status === 409){
                setError("The user already exists. Please signup with a different email....");
                return;
            }

            const data = await res.json();
            if(res.status === 201) {
                setUser(data);
                history.push("/dash");
            }

        }catch(err:any) {
            console.log(err);
        }finally{
            setSubmitting(false);
        }
    };

    return(
        <Container>
            <Jumbotron>
                <Container>
                    <Row>
                        <Col>
                            <h1>Welcome to a 🗺 Location based social media platform</h1>
                        </Col>
                    </Row>
                    <Row style={{marginTop:20}}>
                        <Col lg={4}>
                            <h5>Signup for the app</h5>
                            {error &&
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                   <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                    <p>
                                        {error}
                                    </p>
                                </Alert>}
                            <Form onSubmit={signup}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="First Name"
                                        required={true}
                                        value={firstName}
                                        onChange={(e:any) => setFirstName(e.target.value)}/>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Last name"
                                        required={true}
                                        value={lastName}
                                        onChange={(e:any) => setlastName(e.target.value)}/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Group>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    required={true}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}/>
                                <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    required={true}
                                    value={password}
                                    onChange= {e => setPassword(e.target.value)}/>
                            </Form.Group>
                            <Button
                                variant="success"
                                type="submit"
                                style={{display:"block", marginBottom:10}}
                                disabled={submitting}>
                                Login
                            </Button>
                            <Link to="/">Already a user? Login</Link>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
        </Container>
    );
};

export default Signup;