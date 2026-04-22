import { useState } from "react";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../auth/firebase";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");

    if (!isFirebaseConfigured) {
      setError("Add your Firebase env values in the Client .env file, then restart Vite.");
      return;
    }

    if (!auth) {
      setError("Firebase auth is not ready yet. Check your env values and restart the app.");
      return;
    }

    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const errorCode = err?.code || "";

      if (errorCode === "auth/popup-blocked") {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      if (errorCode === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase. Add your Vercel domain in Firebase Auth > Settings > Authorized domains.");
        return;
      }

      setError(err?.message || "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-video-shell" aria-hidden="true">
        <video className="login-video" autoPlay muted loop playsInline>
          <source src="/login-bg.mp4" type="video/mp4" />
        </video>
        <div className="login-video-overlay" />
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-brand-row">
            <img className="login-brand-logo" src="/QT%20icons/arbor_logo.png" alt="" />
            <span className="login-brand-name">Arbor</span>
          </div>

          <h2 className="login-title">Welcome to Arbor</h2>
          <p className="login-subtitle">Sign in with Google to start building your tree</p>

          <button className="google-login-button" onClick={handleGoogleLogin} disabled={isLoading}>
            <span className="google-login-icon" aria-hidden="true">G</span>
            <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
          </button>

          {error ? <p className="login-error">{error}</p> : null}

          <p className="login-video-note"></p>
        </div>
      </div>
    </div>
  );
};

export default Login;