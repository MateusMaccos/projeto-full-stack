import "./LoginSignup.css";
import PersonIcon from "@mui/icons-material/Person";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MailIcon from "@mui/icons-material/Mail";
import HttpsIcon from "@mui/icons-material/Https";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../Services/Firebase";

const LoginSignup = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("Sign Up");

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});

  useEffect(() => {
    setUser("");
    setEmail("");
    setPassword("");
  }, [action]);

  const validate = () => {
    const err: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    } = {};

    if (action === "Sign Up" && user.trim() === "") {
      err.name = "Name is required";
    }
    if (!email.includes("@") || email.trim() === "") {
      err.email = "Email is required";
    }
    if (action === "Sign Up" && email.trim() === "") {
      err.phone = "Phone is required";
    }
    if (password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setError(err);
    return Object.keys(err).length === 0;
  };
  const searchUser = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      );
      return { success: true, user: userCredentials.user };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  const handleLogin = async () => {
    const search = await searchUser();
    if (search.success) {
      navigate("/menu");
      localStorage.setItem("user", JSON.stringify(search.user));
    } else {
      alert("Credenciais inválidas!");
    }
  };
  const handleSubmit = () => {
    if (validate()) {
      alert("Acess with Success!");
      createUserWithEmailAndPassword(getAuth(), email, password)
        .then(async (userCredential) => {
          const uid = userCredential.user.uid;
          console.log(uid);
          await setDoc(doc(db, "users", uid), {
            name: user,
            phone: phone,
            email: email,
          }).then(() => {
            localStorage.setItem("user", JSON.stringify(userCredential.user));
            navigate("/menu");
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? (
          <div></div>
        ) : (
          <div className="input">
            <div className="icon">
              <PersonIcon style={{ fontSize: 40 }} />
            </div>

            <input
              type="text"
              placeholder="Name"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
              }}
            />
            {error.name && <div className="error">{error.name}</div>}
          </div>
        )}
        {action === "Login" ? (
          <div></div>
        ) : (
          <div className="input">
            <div className="icon">
              <PhoneAndroidIcon style={{ fontSize: 40 }} />
            </div>

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
            {error.phone && <div className="error">{error.phone}</div>}
          </div>
        )}

        <div className="input">
          <div className="icon">
            <MailIcon style={{ fontSize: 40 }} />
          </div>

          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {error.email && <div className="error">{error.email}</div>}
        </div>
        <div className="input">
          <div className="icon">
            <HttpsIcon style={{ fontSize: 40 }} />
          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {error.password && <div className="error">{error.password}</div>}
        </div>
      </div>
      {action === "Sign Up" ? (
        <div></div>
      ) : (
        <div className="forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>
      )}

      <div className="submit-container">
        <div
          className={action == "Login" ? "submit gray" : "submit"}
          onClick={
            action == "Sign Up"
              ? handleSubmit
              : () => {
                  setAction("Sign Up");
                }
          }
        >
          Sign Up
        </div>
        <div
          className={action == "Sign Up" ? "submit gray" : "submit"}
          onClick={
            action == "Login"
              ? handleLogin
              : () => {
                  setAction("Login");
                }
          }
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
