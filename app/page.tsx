'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    _id: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.date || !newTransaction.description) {
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
      
      setNewTransaction({ _id: '', amount: 0, date: new Date().toISOString().split('T')[0], description: '' });
      setEditingTransaction(null);
      setIsOpen(false);
      fetchTransactions();
      setError(null);
    } catch (err) {
      setError('Error saving transaction');
    }
  };

  const handleDelete = async (id: string) => {
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

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      _id: transaction._id,
      amount: transaction.amount,
      date: transaction.date.split('T')[0],
      description: transaction.description,
    });
    setIsOpen(true);
  };

  const monthlyData = transactions.reduce((acc, curr) => {
    const month = format(new Date(curr.date), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + Math.abs(curr.amount);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData).map(([name, value]) => ({
    name,
    expenses: value,
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Personal Finance Visualizer</h1>
      
      <div className="flex justify-center mb-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit">{editingTransaction ? 'Update' : 'Add'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Monthly Expenses</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expenses" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEdit(transaction)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(transaction._id)}>
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