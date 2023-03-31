// import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

export const AuthStatus: React.FC = () => {
    const auth = useAuth()

    if (auth.user === null) {
        return <p>You are not logged in.</p>
    }

    return (
        <p>
            Welcome {auth.user.email}!{' '}
        </p>
    )
}