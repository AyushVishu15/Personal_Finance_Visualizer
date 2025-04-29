import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const budgets = await readBudgets();
    const index = budgets.findIndex((b: any) => b._id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    budgets[index] = { ...body, _id: params.id };
    await writeBudgets(budgets);
    return NextResponse.json(budgets[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating budget' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const budgets = await readBudgets();
    const filteredBudgets = budgets.filter((b: any) => b._id !== params.id);
    if (filteredBudgets.length === budgets.length) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    await writeBudgets(filteredBudgets);
    return NextResponse.json({ message: 'Budget deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting budget' }, { status: 500 });
  }
}