import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

    console.log("Logout request received")
    try {
        // Create a response that clears the token cookie
        // const response = NextResponse.json({ success: true }, { status: 200 })
        const token = request.cookies.get("token")?.value


        console.log("Token: ", token)
        const response = await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST', // Use POST (or GET if your controller expects it)
            headers: {
                'Content-Type': 'application/json',
                "x-auth-token": token || "",
                'Cookie': `token=${token}`, // Include the token if needed
            },
            credentials: "include",
        });


        // Clear the token cookie
        request.cookies.delete("token")

        return response
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json({ error: "Logout failed" }, { status: 500 })
    }
}
