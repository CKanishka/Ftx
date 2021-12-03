import { useState } from 'react'
import firebase from "firebase/compat";
import { useNavigate } from "react-router-dom";
import './Signup.css';

export default function SignUp() {
    const history = useNavigate();
    const [signUp, signUpSet] = useState({name: "", password: "", email: "", type: "Business", phonemumber: ""})
    const [name, setName] = useState('Name');
    const [errorMessage, setErrorMessage] = useState('');
    function handleEmailChange(e) {
        signUpSet({...signUp, email: e.target.value})
    }
    function handlePasswordChange(e) {
        signUpSet({...signUp, password: e.target.value})
    }
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = "user" + "=" + JSON.stringify(cvalue) + ";" + expires + ";path=/";
    }
    function registerUser() {
        const data = {
                "name": signUp.name,
                "email": signUp.email,
                "type": signUp.type,
                "phone": signUp.phonemumber
            }
        fetch('http://ee2c-122-163-249-4.ngrok.io/api/register',
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: data
            })
            .then(res => {
                console.log(res,"sucess")
            })
            .catch(err => {
                console.log(err)
            })
    }    
    function getId() {
        fetch(`http://ee2c-122-163-249-4.ngrok.io/api/id?email=${signUp.email}&type=${signUp.type}`,
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "GET",
            })
            .then(res => {
                console.log(res,"sucess")
            })
            .catch(err => {
                console.log(err)
            })
    }
    async function handleSubmitClick() {
        try{
            const credentials = await firebase.auth().createUserWithEmailAndPassword(signUp.email, signUp.password);
            await credentials.user?.updateProfile({displayName: `${signUp.name}`});
            let userData = {
                name: signUp.fname,
                email: signUp.email,
                password: signUp.password,
                userType: signUp.type
            }
            setCookie(signUp.email, {isLogedIn: true, type: signUp.type}, 1)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            };
            const promise=[];
            promise.push(registerUser());
            promise.push(getId())
            promise.all(promise)
            .then(()=>{
                if(signUp.type === 'Customer') {
                    history('/customer/dashboard');
                } else {
                    history('/business/dashboard');
                }
            })
            
        }
        catch(error){
            return setErrorMessage(error.message);
        }
    }
    function handleNameChange(e) {
        signUpSet({...signUp, name: e.target.value})
    }
    function handleTypeChange(e) {
        console.log(e.target.value)
        if(e.target.value === 'Customer') {
            setName('Name')
        }else { 
            setName('Shop Name')
        }
        signUpSet({...signUp, type: e.target.value})
    }
    function handleBackClick() {
        history(-1)
    }
    function handlePhonenumberChange(e) {
        signUpSet({...signUp, phonemumber: e.target.value})
    }
    return (
        <div className="signup-parent-container">
            <div className="signup-parent">
                <div className="backIcon" onClick={handleBackClick}>
                    <img height="40px" width="40px" src="https://static.thenounproject.com/png/344330-200.png" />
                </div>
            <div id="signup-card">
                <div id="card-content">
                <div id="card-title">
                    <h2>SIGN UP</h2>
                    <div class="underline-title"></div>
                </div>
                <form method="post" class="form">
                    <label className="user-mail" for="user-email">
                        {`${name}`}
                    </label>
                    <input id="user-email" className="form-content" type="name" name="name" autocomplete="on" required onChange={handleNameChange} />
                    <div class="form-border"></div>
                    <label className="user-mail" for="user-email">
                        &nbsp;Email
                    </label>
                    <input id="user-email" className="form-content" type="email" name="email" autocomplete="on" required onChange={handleEmailChange} />
                    <div class="form-border"></div>
                    <label className="user-password" for="user-password">&nbsp;Password
                    </label>
                    <input id="user-password" class="form-content" type="password" name="password" required onChange={handlePasswordChange}/>
                    <div class="form-border"></div>
                    <label className="user-phonemumber" for="user-phonemumber">&nbsp;Phonemumber
                    </label>
                    <input id="user-phonemumber" class="form-content" type="mumber" name="phonemumber" required onChange={handlePhonenumberChange}/>
                    <div class="form-border"></div>
                    {/* <a id="forgot-pass-parent" href="#">
                        <legend id="forgot-pass">Forgot password?</legend>
                    </a> */}
                    <div className="type-container">
                        <input className="radio-first" type="radio" value="Business" name="gender" checked="checked" onChange={handleTypeChange}/> Bussiness
                        <input className="radio-second" type="radio" value="Customer" name="gender"  onChange={handleTypeChange}/> Customer
                    </div>
                    <div id="signup-submit-btn"  onClick={handleSubmitClick}>Submit</div>
                </form>
                </div>
            </div>
            </div>
        </div>
    )
}