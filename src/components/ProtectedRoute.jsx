import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import Spinner from "./Spinner"; // Optional: your custom loading component

const ProtectedRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) return <Spinner />; // Show spinner while checking auth
    if (!user) return <Navigate to="/login" />; // Redirect if not logged in

    return children;
};

export default ProtectedRoute;
