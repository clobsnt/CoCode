// Verify the token 
export const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return { authenticated: false, email: null };
    }

    try {
        const response = await fetch("http://localhost:4000/api/protected", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Unauthorized");
        }

        const data = await response.json();
        return { authenticated: true, email: data.email, message: data.message };
    } catch (err) {
        console.error("Token verification failed: ", err);
        return { authenticated: false, email: null };
    }
};