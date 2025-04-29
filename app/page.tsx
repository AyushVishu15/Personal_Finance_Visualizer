'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface Budget {
  _id: string;
  month: string;
  categories: { [key: string]: number };
}

const categories = ['Food', 'Utilities', 'Entertainment', 'Insurance', 'Health', 'Shopping', 'Uncategorized'];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FEF', '#FF6F61', '#D3D3D3'];

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    _id: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Uncategorized',
  });
  const [newBudget, setNewBudget] = useState<{ month: string; categories: { [key: string]: number } }>({
    month: '2025-04',
    categories: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
  });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data: Transaction[] = await response.json();
      setTransactions(data);
    } catch (err) {
      setError('Error fetching transactions');
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      if (!response.ok) throw new Error('Failed to fetch budgets');
      const data: Budget[] = await response.json();
      setBudgets(data);
    } catch (err) {
      setError('Error fetching budgets');
    }
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.date || !newTransaction.description || !newTransaction.category) {
      setError('All fields are required');
      return;
    }

    try {
      const method = editingTransaction ? 'PUT' : 'POST';
      const url = editingTransaction ? `/api/transactions/${editingTransaction._id}` : '/api/transactions';
      const transactionToSave: Transaction = {
        ...newTransaction,
        _id: editingTransaction ? editingTransaction._id : uuidv4(),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionToSave),
      });

      if (!response.ok) throw new Error('Failed to save transaction');
      
      setNewTransaction({ _id: '', amount: 0, date: new Date().toISOString().split('T')[0], description: '', category: 'Uncategorized' });
      setEditingTransaction(null);
      setIsTransactionOpen(false);
      fetchTransactions();
      setError(null);
    } catch (err) {
      setError('Error saving transaction');
    }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.month) {
      setError('Month is required');
      return;
    }

    try {
      const method = editingBudget ? 'PUT' : 'POST';
      const url = editingBudget ? `/api/budgets/${editingBudget._id}` : '/api/budgets';
      const budgetToSave = {
        ...newBudget,
        _id: editingBudget ? editingBudget._id : uuidv4(),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetToSave),
      });

      if (!response.ok) throw new Error('Failed to save budget');
      
      setNewBudget({ month: '2025-04', categories: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}) });
      setEditingBudget(null);
      setIsBudgetOpen(false);
      fetchBudgets();
      setError(null);
    } catch (err) {
      setError('Error saving budget');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      fetchTransactions();
    } catch (err) {
      setError('Error deleting transaction');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      _id: transaction._id,
      amount: transaction.amount,
      date: transaction.date.split('T')[0],
      description: transaction.description,
      category: transaction.category,
    });
    setIsTransactionOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setNewBudget({
      month: budget.month,
      categories: { ...budget.categories },
    });
    setIsBudgetOpen(true);
  };

  // Dashboard Data
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryData = categories.map((category) => ({
    name: category,
    value: transactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0),
  })).filter((d) => d.value > 0);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const currentMonth = '2025-04'; // Hardcoded for demo; could be dynamic
  const currentBudget = budgets.find((b) => b.month === currentMonth);
  const budgetVsActual = categories.map((category) => ({
    name: category,
    budget: currentBudget?.categories[category] || 0,
    actual: transactions
      .filter((t) => t.category === category && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  // Spending Insights
  const highestCategory = categoryData.reduce((max, curr) => (curr.value > max.value ? curr : max), { name: '', value: 0 });
  const overBudgetCategories = budgetVsActual.filter((d) => d.actual > d.budget).map((d) => d.name);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Personal Finance Visualizer</h1>

      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {categoryData.map((cat) => (
                <li key={cat.name}>
                  {cat.name}: ${cat.value.toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {recentTransactions.map((t) => (
                <li key={t._id}>
                  {format(parseISO(t.date), 'MMM dd')} - {t.description}: ${t.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Spending Insights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Highest Spending Category: {highestCategory.name} (${highestCategory.value.toFixed(2)})</p>
          {overBudgetCategories.length > 0 && (
            <p className="text-red-500">
              Over Budget: {overBudgetCategories.join(', ')}
            </p>
          )}
          {overBudgetCategories.length === 0 && (
            <p className="text-green-500">All categories within budget!</p>
          )}
        </CardContent>
      </Card>

      {/* Add Transaction Button */}
      <div className="flex justify-center mb-4">
        <Dialog open={isTransactionOpen} onOpenChange={setIsTransactionOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-2 border-black bg-transparent text-black px-6 py-3 text-lg font-semibold hover:bg-black hover:text-white transition-colors"
              onClick={() => {
                setEditingTransaction(null);
                setNewTransaction({
                  _id: '',
                  amount: 0,
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  category: 'Uncategorized',
                });
              }}
            >
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle className="text-black">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-black">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                  required
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-black">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  required
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-black">Description</Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  required
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-black">Category</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                >
                  <SelectTrigger className="text-black">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit">{editingTransaction ? 'Update' : 'Add'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add/Edit Budget Button */}
      <div className="flex justify-center mb-4">
        <Dialog open={isBudgetOpen} onOpenChange={setIsBudgetOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-2 border-black bg-transparent text-black px-6 py-3 text-lg font-semibold hover:bg-black hover:text-white transition-colors"
              onClick={() => {
                setEditingBudget(null);
                setNewBudget({
                  month: '2025-04',
                  categories: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
                });
              }}
            >
              {editingBudget ? 'Edit Budget' : 'Set Budget'}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle className="text-black">
                {editingBudget ? 'Edit Budget' : 'Set Budget'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <div>
                <Label htmlFor="month" className="text-black">Month</Label>
                <Input
                  id="month"
                  type="month"
                  value={newBudget.month}
                  onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
                  required
                  className="text-black"
                />
              </div>
              {categories.map((cat) => (
                <div key={cat}>
                  <Label htmlFor={`budget-${cat}`} className="text-black">{cat} Budget</Label>
                  <Input
                    id={`budget-${cat}`}
                    type="number"
                    value={newBudget.categories[cat]}
                    onChange={(e) =>
                      setNewBudget({
                        ...newBudget,
                        categories: { ...newBudget.categories, [cat]: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="text-black"
                  />
                </div>
              ))}
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit">{editingBudget ? 'Update' : 'Set'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Pie Chart */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Spending by Category</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget vs Actual Chart */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Budget vs Actual</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetVsActual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="budget" fill="#8884d8" />
              <Bar dataKey="actual" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Expenses Bar Chart */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Monthly Expenses</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(
              transactions.reduce((acc, curr) => {
                const month = format(new Date(curr.date), 'MMM yyyy');
                acc[month] = (acc[month] || 0) + Math.abs(curr.amount);
                return acc;
              }, {} as Record<string, number>)
            ).map(([name, value]) => ({ name, expenses: value }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expenses" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEditTransaction(transaction)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteTransaction(transaction._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}