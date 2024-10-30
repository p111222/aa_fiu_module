import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../../Context/AuthContext';
import CryptoJS from 'crypto-js';
// import { makeRequest } from '../../Axios';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://localhost:3000/">
                AA_Redirect
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const LoginPage = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState(""); 
    const [showEmailMsg, setShowEmailMsg] = useState(false); 
    const [showPasswordMsg, setShowPasswordMsg] = useState(false); 
    // const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, setUser, setAccessToken } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(inputs), process.env.REACT_APP_ENCRYPTION_KEY).toString();    
        
    //     axiosPrivate.post("/auth/login",
    //         { data: encryptedData },
    //     )
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 setUser({
    //                     userName: res.data.userName,
    //                     userEmail: res.data.userEmail,
    //                     sessionId: res.data.sessionId,
    //                 })
    //                 setAccessToken(res.data.accessToken)
    //                 console.log("login successfully");
    //                 navigate("/user/verifyaaid")
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (inputs.email === "") {
            setMessage("Please enter your email.");
            setShowEmailMsg(true);
            return;
        }
        if (inputs.password === "") {
            setMessage("Please enter your password.");
            setShowPasswordMsg(true);
            return;
        }
    
        const iv = CryptoJS.lib.WordArray.random(16);
        
        const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_ENCRYPTION_KEY);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(inputs), key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        });
    
        const encryptedData = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    
        try {
            const res = await axiosPrivate.post("/api/auth/login", { data: encryptedData });
            if (res.status === 200) {
                setUser({
                    userName: res.data.userName,
                    userEmail: res.data.userEmail,
                    sessionId: res.data.sessionId,
                });
                setAccessToken(res.data.accessToken);
                console.log("Login successfully");
                navigate("/user/verifyaaid");
            }
        } catch (error) {
            console.log(error);
        }
    };
    

    useEffect(() => {
        if (user) {
            navigate('/user/verifyaaid')
        }
    }, [user])


    return (
        <div style={{ minHeight: '100vh' }}>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            paddingTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoFocus
                                // value={inputs.email}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                            />
                            <div className='text-start'>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                            </div>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                                onClick={handleLogin}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default LoginPage;