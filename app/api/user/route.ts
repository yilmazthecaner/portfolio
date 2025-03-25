import { type NextRequest, NextResponse } from "next/server"
import type { User, UserUpdateData } from "@/types/user"

// Mock user data
const currentUser: User = {
  id: "user1",
  name: "Caner Yılmaz",
  email: "caner@rasyonet.com",
  imageUrl: "/placeholder.svg?height=128&width=128",
  budget: {
    totalBalance: 45231.89,
    investments: 12234.0,
    cash: 5231.89,
    activePositions: 12,
  },
}

// GET handler for fetching current user
export async function GET() {
  try {
    // Set proper content type header
    return NextResponse.json(currentUser, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

// PUT handler for updating user
export async function PUT(request: NextRequest) {
  try {
    const data: UserUpdateData = await request.json()

    // Update user data
    if (data.name) currentUser.name = data.name
    if (data.email) currentUser.email = data.email
    if (data.imageUrl) currentUser.imageUrl = data.imageUrl

    return NextResponse.json(currentUser, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

export { currentUser }

