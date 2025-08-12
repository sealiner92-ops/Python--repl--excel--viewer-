# Python REPL + Excel Viewer Project

A comprehensive Python development environment featuring both a web-based REPL and a desktop Excel data viewer application.

## 🌟 Features

### Web-Based Python REPL
- Interactive Python code execution in the browser
- Real-time output display with syntax highlighting
- Session management and execution history
- Mobile-responsive design
- Built with React, TypeScript, and Node.js

### Desktop Excel Viewer (Kivy)
- Load and view Excel files (.xlsx, .xls)
- Real-time search across all columns
- File chooser dialog for selecting Excel files
- Sample data included for testing
- Built with Kivy framework and Pandas

## 🚀 Quick Start

### Web REPL
```bash
npm run dev
```
Open your browser to see the interactive Python REPL.

### Desktop Excel Viewer
```bash
python main.py
```

## 📦 Dependencies

### Node.js (Web REPL)
- React 18 + TypeScript
- Express.js backend
- Vite for development
- TanStack Query for state management

### Python (Desktop App)
- Kivy 2.3.1 - GUI framework
- Pandas 2.3.1 - Data processing
- OpenPyXL 3.1.5 - Excel file handling

## 📁 Project Structure

```
├── client/                 # React frontend
├── server/                 # Node.js backend
├── shared/                 # Shared schemas
├── main.py                 # Kivy Excel viewer app
├── data.xlsx               # Sample Excel data
├── python_requirements.txt # Python dependencies
└── README_Python_App.md    # Detailed Python app docs
```

## 🎯 Usage

### Web REPL
1. Write Python code in the browser editor
2. Press Ctrl+Enter or click Run to execute
3. View output in the right panel
4. History is maintained per session

### Excel Viewer
1. Launch with `python main.py`
2. Click "Load Sample Data" to see example data
3. Use the search box to filter data in real-time
4. Click "Load Excel File" to browse for your own files

## 🛠️ Development

The project uses modern development practices:
- TypeScript for type safety
- ESLint and Prettier for code quality
- Hot module replacement for fast development
- Session-based architecture for the REPL

## 📊 Sample Data

Includes a sample Excel file with employee data:
- 10 rows of realistic employee information
- 7 columns: Name, Age, Department, Salary, Join_Date, Performance_Rating, City

## 📝 License

MIT License - feel free to use and modify as needed.