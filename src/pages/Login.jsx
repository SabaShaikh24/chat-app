import { useState } from "react";
import supabase from "../lib/supabaseClient";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    if (isSignup) {
      // 🔐 SIGNUP
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Signup successful! Now login.");
        setIsSignup(false);
      }
    } else {
      // 🔐 LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        setIsLoggedIn(true);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: "20px" }}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p style={{ marginTop: "10px" }}>
          {isSignup ? "Already have an account?" : "New user?"}
        </p>

        <button
          style={styles.toggleBtn}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Login" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#121212",
  },
  card: {
    background: "#1e1e1e",
    padding: "30px",
    borderRadius: "12px",
    width: "300px",
    textAlign: "center",
    color: "white",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  toggleBtn: {
    marginTop: "5px",
    background: "transparent",
    color: "#4CAF50",
    border: "none",
    cursor: "pointer",
  },
};