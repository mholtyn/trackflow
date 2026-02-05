import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token")

        queryClient.clear()

        navigate("/login")
    }

    return logout;
}