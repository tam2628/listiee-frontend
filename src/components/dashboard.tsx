import { useContext, useState, useEffect , useCallback, useLayoutEffect} from 'react';
import { Container, Row, Col, Spinner, Card, Form, Button, Navbar, Nav } from 'react-bootstrap';
import UserContext from "../userContext";
import { ALL_POST_URL } from '../constants';
import convert from 'xml-js';
import { POST_URL, LOGOUT_URL } from '../constants';
import { useHistory } from 'react-router-dom';

function Dashboard() {
    const {user, setUser} = useContext(UserContext);
    const [posts, setPosts] = useState<any>([]);
    const [file, setFile] = useState(null);
    const [fileURL, setFileURL] = useState(undefined);
    const [postText, setPostText] = useState("");
    const [lat, setLat] = useState(Infinity);
    const [long, setLong] = useState(Infinity);
    const [submitting, setSubmitting] = useState(false);
    const [val, setVal] = useState("");
    const [fetched, setFetched] = useState(false);
    const history = useHistory();

    const calculateDistance = (lat1:number, lon1:number, lat2:number, lon2:number) => {
        var R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1); // deg2rad below
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
      };

    useEffect(() => {
       fetch(ALL_POST_URL)
       .then(res => res.json())
       .then(posts => {
            const geo = window.navigator.geolocation;
            if(geo){
                geo.getCurrentPosition((position) => {
                    setLat(position.coords.latitude);
                    setLong(position.coords.longitude);
                });
            }

            if(lat !== Infinity && long !== Infinity)
            {
                for (let i = 0; i < posts.length; i++) {
                    posts[i]['distance'] = calculateDistance(
                        lat,
                        long,
                        posts[i]['latitude'],
                        posts[i]['longitude']
                    );
                }
                posts.sort((a:any , b:any) => {
                    return a.distance - b.distance;
                });
            }
            setPosts(posts);
            setFetched(true);
        })
       .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if(file === null) return;
        const reader = new FileReader();
        reader.onload = (e:any) => setFileURL(e.target.result);
        reader.readAsDataURL((file as unknown as Blob));
    }, [file]);

    function deg2rad(deg:number) {
        return deg * (Math.PI / 180);
    }



    const submitPost = async (e:any) => {
        e.preventDefault();
        setSubmitting(true);
        let res = await fetch("https://cors-anywhere.herokuapp.com/https://api.3geonames.org/?randomland=yes");
        const data = await res.text();
        const json = convert.xml2js(data);
        const d = (json.elements[0].elements[0]).elements;
        const
            latt = d[0].elements[0].text,
            long = d[1].elements[0].text,
            place = d[4].elements[0].text;

        let uploadRes, fileRes;
        try{
            //const fileName = new Date().toString()+user.id;
            //uploadRes = await ReactS3Client.uploadFile(file, fileName);
            //fileRes = await uploadRes.json();
            const formData = new FormData();
            formData.append("image", file as unknown as Blob);
            formData.append("latitude", latt);
            formData.append("longitude", long);
            formData.append("postText", postText);
            formData.append("country", place);

            res = await fetch(POST_URL, {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Authorization": `Bearer ${user.accessToken}`,
                },
                body: formData
                // body: JSON.stringify({
                //     image: uploadRes.location,
                //     latitude: latt,
                //     longitude: long,
                //     postText,
                // })
            });
            const post = await res.json();
            if(res.status === 201) {
                post["distance"] = calculateDistance(lat, long, post.latitude, post.longitude);
                setPosts([post, ...posts]);
                setFile(null);
                setFileURL(undefined);
                setPostText("");
                setVal("");
            }
        } catch(err){
            console.log(err);
        }finally{
            setSubmitting(false);
        }


    }

    const logout = async (e:any) => {
        e.preventDefault();
        let res;
        try{
            res = await fetch(LOGOUT_URL, {
                method: 'post',
                credentials: 'include'
            });

            if(res.status === 200){
                setUser(null);
                history.push("/");
            }
        }catch(err) {
            console.log(err);
        }
    }

    return(
        <>
        <Navbar>
            <Container>
                <Navbar.Brand href="#">Location Media 🗺</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Signed in as: {user && user.firstName} {user && user.lastName}
                    </Navbar.Text>
                    <Nav>
                        <Nav.Link onClick={logout} >👋Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Container>
            {/* {user &&JSON.stringify(user, null, 2)} */}
            <Row>
                <Col lg={{span:6, offset:3}}>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={submitPost}>
                                <Form.Group>
                                    <Form.Control   as="textarea"
                                                    rows={5}
                                                    style={{resize:"none"}}
                                                    value={postText}
                                                    onChange={(e) => setPostText(e.target.value)}
                                                    required={true}/>
                                </Form.Group>
                                    <Form.Group>
                                        <Form.File  id="imageFileInput"
                                                    value={val}
                                                    label="Upload Image 🖼"
                                                    onChange={(e:any) => {
                                                        setVal(e.target.value)
                                                        setFile(e.target.files[0])
                                                    }}/>
                                    </Form.Group>
                                    {fileURL && <Card.Img variant="top" src={fileURL} style={{marginBottom:10}}></Card.Img>}
                                    <Button
                                        variant="success"
                                        type="submit"
                                        style={{display:"block", marginBottom:10}}
                                        disabled={submitting}
                                    >
                                        Post status
                                    </Button>
                                </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={{span:6, offset:3}}>
                    {
                        !fetched ?
                        <Spinner animation="grow"/> :
                        posts.length === 0 ? <h3>No posts 😦</h3>:
                        posts.map((p:any, key:number) => {
                            return (
                                <Card key={key}>
                                    <Card.Body>
                                        <Card.Text>{p.postText}</Card.Text>
                                        <Card.Text style={{color:"gray", fontSize:12}}>{p.User.firstName} {p.User.lastName} - {p.country}</Card.Text>
                                    </Card.Body>
                                    <Card.Img variant="top" src={p.picture} />
                                </Card>
                            )
                        })
                    }
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default Dashboard;