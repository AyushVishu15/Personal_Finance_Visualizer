import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

export async function GET() {
  try {
    const transactions = await readTransactions();
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transactions = await readTransactions();
    const newTransaction = { ...body, _id: body._id || uuidv4() };
    transactions.push(newTransaction);
    await writeTransactions(transactions);
    return NextResponse.json(newTransaction);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 });
  }
}