import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import ChatWindow from "./components/ChatWindow";
import Login from "./pages/Login";
import { auth } from "./auth/firebase";
import { clearAuthToken, setAuthToken } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        clearAuthToken();
        setUser(null);
        setAuthReady(true);
        return;
      }

      const token = await currentUser.getIdToken(true);
      setAuthToken(token);
      setUser({
        uid: currentUser.uid,
        displayName: currentUser.displayName || "Google User",
        email: currentUser.email || "",
        photoURL: currentUser.photoURL || "",
      });
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    clearAuthToken();
  };

  if (!authReady) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2 className="login-title">Checking your session...</h2>
          <p className="login-subtitle">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <ChatWindow user={user} onLogout={handleLogout} />;
}

export default App;