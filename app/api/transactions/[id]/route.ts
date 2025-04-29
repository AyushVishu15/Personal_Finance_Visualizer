import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'transactions.json');

async function readTransactions() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeTransactions(transactions: any[]) {
  await fs.writeFile(filePath, JSON.stringify(transactions, null, 2));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const transactions = await readTransactions();
    const index = transactions.findIndex((t: any) => t._id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    transactions[index] = { ...body, _id: params.id };
    await writeTransactions(transactions);
    return NextResponse.json(transactions[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const transactions = await readTransactions();
    const filteredTransactions = transactions.filter((t: any) => t._id !== params.id);
    if (filteredTransactions.length === transactions.length) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    await writeTransactions(filteredTransactions);
    return NextResponse.json({ message: 'Transaction deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 });
  }
}