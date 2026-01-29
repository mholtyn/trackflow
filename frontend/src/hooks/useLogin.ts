import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUserApiTokenPost } from "@/client";
import type { BodyLoginUserApiTokenPost, Token } from "@/client";

function useLogin() {
    // const queryClient = useQueryClient();

    return useMutation<Token, Error, BodyLoginUserApiTokenPost>({
        mutationFn: async (loginData) => {
            const res = await loginUserApiTokenPost({body: loginData})

            if (res.error) {
                throw new Error(JSON.stringify(res.error))
            }

            if (!res.data) {
                throw new Error("No data returned from login")
            }

            return res.data
        },

        onSuccess: (data) => {
            localStorage.setItem("token", data.access_token)
        },

        onError: (error) => {
            console.error("Login failed:", error)
        },
    })
}

export default useLogin;