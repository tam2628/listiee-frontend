import { Button, Col, Container, Jumbotron, Row, Form } from "react-bootstrap";
import { Link, useHistory } from 'react-router-dom';
import { useState, useContext } from 'react';
import { LOGIN_URL } from './../constants';
import UserContext from './../userContext';

function Index () {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const {setUser} = useContext(UserContext);
    const history = useHistory();

    const login = async (event:React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        let res;
        try{
            res = await fetch(LOGIN_URL, {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const resp = await res.json();

            if(res.status === 200) {
                setUser(resp);
                history.push("/dash");
            }
        } catch(err:any) {
            console.log(err);
        } finally {
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
                            <h5>Login to the app</h5>
                            <Form onSubmit={login}>
                            <Form.Group controlId="formBasicEmail">
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

                            <Form.Group controlId="formBasicPassword">
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
                            <Link to="/signup">Not a user? Signup</Link>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
            <h5>© Tauseef Ahmad ⚡⚡⚡</h5>
        </Container>
    );
};

export default Index;