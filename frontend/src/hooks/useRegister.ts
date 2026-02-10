import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { registerApiRegisterPost } from "@/client";
import type { RegisterApiRegisterPostData, RegisterApiRegisterPostError, RegisterApiRegisterPostResponse } from "@/client";


function useRegister() {
    const navigate = useNavigate();

    return useMutation<RegisterApiRegisterPostResponse, RegisterApiRegisterPostError, RegisterApiRegisterPostData['body']>({
        mutationFn: async (registerData) => {
            const res = await registerApiRegisterPost({body: registerData})

            if (res.error) {
                throw new Error(JSON.stringify(res.error))
            }

            if (!res.data) {
                throw new Error("No data returned from register")
            }

            return res.data
        },

        onSuccess: () => {
            navigate("/login")
        },

        onError: (error) => {
            console.error("Registration failed:", error)
        },
    })
}
export default useRegister;