import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'data', 'budgets.json');

async function readBudgets() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeBudgets(budgets: any[]) {
  await fs.writeFile(filePath, JSON.stringify(budgets, null, 2));
}

export async function GET() {
  try {
    const budgets = await readBudgets();
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching budgets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const budgets = await readBudgets();
    const newBudget = {
      ...body,
      _id: body._id || uuidv4(),
    };
    budgets.push(newBudget);
    await writeBudgets(budgets);
    return NextResponse.json(newBudget);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating budget' }, { status: 500 });
  }
}