import { type NextRequest, NextResponse } from "next/server"
import type { TransactionFormData } from "@/types/transaction"
import { transactions } from "../route"

// GET handler for fetching a single transaction
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const transaction = transactions.find((t) => t.id === id)

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404, headers: { "Content-Type": "application/json" } },
      )
    }

    return NextResponse.json(transaction, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

// PUT handler for updating a transaction
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data: Partial<TransactionFormData> = await request.json()

    // Find the transaction
    const index = transactions.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404, headers: { "Content-Type": "application/json" } },
      )
    }

    // Update the transaction
    const updatedTransaction = {
      ...transactions[index],
      ...data,
      // Recalculate value if amount or price changed
      value:
        data.amount && data.price
          ? data.amount * data.price
          : data.amount
            ? data.amount * transactions[index].price
            : data.price
              ? transactions[index].amount * data.price
              : transactions[index].value,
    }

    transactions[index] = updatedTransaction

    return NextResponse.json(updatedTransaction, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json(
      { message: "Failed to update transaction" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

// DELETE handler for removing a transaction
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Changed: await params before using id
    const { id } = await params;
    const index = transactions.findIndex((t) => t.id === id)

    if (index === -1) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404, headers: { "Content-Type": "application/json" } },
      )
    }

    // Remove the transaction
    transactions.splice(index, 1)

    return NextResponse.json(
      { success: true },
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { message: "Failed to delete transaction" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

