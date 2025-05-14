import { type NextRequest, NextResponse } from "next/server"

// This is a server-side route that checks if the user is authenticated
// by verifying the token cookie with your backend
export async function GET(request: NextRequest) {
  try {
    // Get the token from the cookies
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // Verify the token with your backend
    const response = await fetch("http://localhost:5000/api/auth/user", {
      method: "GET",
      headers: {
        // Cookie: `token=${token}`,
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    // await response.json()
    // const dataData = await response.json(); // Parse the JSON body
    
    
    if (!response.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    const data = await response.json()

    // Return the user data
    return NextResponse.json({ user: data })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
