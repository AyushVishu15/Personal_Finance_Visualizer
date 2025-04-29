# Personal_Finance_Visualizer

A web application built with Next.js to manage and visualize personal financial transactions. Users can add, edit, and delete transactions, view them in a table, and analyze monthly expenses through an interactive bar chart. The app uses a local JSON file for data storage, shadcn/ui for a polished UI, and Recharts for data visualization.

Features
Add Transactions: Input new transactions with amount, date, and description via a form.
Edit/Delete Transactions: Modify or remove existing transactions.
Transaction Table: View all transactions in a responsive table.
Monthly Expense Chart: Visualize monthly spending with a bar chart.
Responsive Design: Optimized for both desktop and mobile devices using Tailwind CSS.
Local Storage: Transactions are stored in a data/transactions.json file.

Screenshots
Home Page
![image](https://github.com/user-attachments/assets/58760a61-0222-4a37-a813-93fe096fd296)

Displays the main interface with the transaction table and monthly expense chart.
![image](https://github.com/user-attachments/assets/249b820e-3465-44dd-9038-b1c44481ca2d)

Add Transaction Form
![image](https://github.com/user-attachments/assets/eb32ee8d-65f0-4f6d-b3e0-23189c100103)

Hover Effect on Add Transaction Button
![image](https://github.com/user-attachments/assets/b05d5587-1899-42c5-a04f-8e51bc658bb5)


Installation
Prerequisites
Node.js (v18 or higher)
npm (v9 or higher)
Git

Steps
Clone the Repository:
git clone https://github.com/Ayushvishu15/Personal_Finance_Visualizer.git
cd Personal_Finance_Visualizer

Install Dependencies:
npm install --legacy-peer-deps

Run the Development Server:
npm run dev

Access the App:Open http://localhost:3000 in your browser.

Usage

Add a Transaction:
Click the "Add Transaction" button .
Fill in the amount, date, and description in the form.
Submit to save the transaction.

Edit/Delete Transactions:
In the transaction table, click "Edit" to modify a transaction or "Delete" to remove it.

View Monthly Expenses:
The bar chart at the top displays total expenses by month, updated automatically as transactions are added.


Technologies Used

Next.js (14.2.28): React framework for server-side rendering and routing.
TypeScript: Static typing for robust code.
Tailwind CSS: Utility-first CSS framework for styling.
shadcn/ui: Reusable UI components (Button, Input, Dialog, Table).
Recharts: Charting library for the monthly expense bar chart.
date-fns: Date formatting and manipulation.
uuid: Unique ID generation for transactions.
Node.js/fs: File system operations for JSON-based storage.



Built  by Ayushvishu15
