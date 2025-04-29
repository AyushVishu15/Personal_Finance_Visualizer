# Personal_Finance_Visualizer

A web application built with **Next.js** to manage and visualize personal financial transactions. Users can add, edit, and delete transactions, categorize spending, set monthly budgets, and gain insights through interactive charts and a dashboard. The app uses local JSON files for data storage, shadcn/ui for a polished UI, and Recharts for data visualization.

## Features
- **Transaction Management**: Add, edit, or delete transactions with amount, date, description, and category.
- **Transaction Table**: View all transactions in a responsive table with category details.
- **Monthly Expense Chart**: Bar chart showing total expenses by month.
- **Categories**: Assign transactions to predefined categories (e.g., Food, Utilities, Entertainment).
- **Category Pie Chart**: Visualize spending distribution across categories.
- **Dashboard**:
  - Total expenses summary.
  - Category spending breakdown.
  - Recent transactions (last 5).
- **Budgeting**: Set monthly budgets for each category.
- **Budget vs. Actual Chart**: Bar chart comparing budgeted vs. actual spending per category.
- **Spending Insights**: Identify highest spending category and receive over-budget warnings.
- **Responsive Design**: Optimized for desktop and mobile using Tailwind CSS.
- **Local Storage**: Transactions and budgets stored in `data/transactions.json` and `data/budgets.json`.

  
## Screenshots

### Home Page
![image](https://github.com/user-attachments/assets/771f3383-0687-495d-9118-e282925a2e9f)
![image](https://github.com/user-attachments/assets/28f66af5-0886-4bc5-a2a9-5913a5b81f8b)
![image](https://github.com/user-attachments/assets/9b694ed7-d3b8-47f2-b442-946b04d4d461)

### Dashboard
![image](https://github.com/user-attachments/assets/98ccc05a-b1dd-45eb-82d1-8822f389f683)

### Add Transaction Form
![image](https://github.com/user-attachments/assets/18faf5c2-2719-416e-b192-2c4e70c2de3b)

### Set Budget Form
![image](https://github.com/user-attachments/assets/d1e2546a-4027-4692-b24e-db4679f354fc)

### Displays the main interface with the transaction table and monthly expense chart.
![image](https://github.com/user-attachments/assets/18fb80a4-c7e1-4bdc-b8ef-853c4a0a5be6)

### Hover Effect on Add Transaction Button
![image](https://github.com/user-attachments/assets/b7c3720b-0259-4634-81ef-d5b2b13f84a5)

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
Click the "Add Transaction" button (black rectangle outline).
Fill in amount, date, description, and select a category.
Submit to save the transaction.

Edit/Delete Transactions:
In the transaction table, click "Edit" to modify a transaction or "Delete" to remove it.

Set a Budget:
Click the "Set Budget" button (black rectangle outline).
Select a month and enter budget amounts for each category.
Submit to save the budget.

View Insights:
The dashboard shows total expenses, category breakdown, and recent transactions.
The pie chart visualizes spending by category.
The budget vs. actual chart compares budgeted and actual spending.
Spending insights highlight the highest spending category and over-budget categories.


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
