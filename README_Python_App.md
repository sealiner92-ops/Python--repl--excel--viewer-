# Kivy Excel Viewer Application

This project includes a complete Python desktop application that reads and displays Excel data using the Kivy framework.

## Project Files

- **`main.py`** - The main Python application code featuring a Kivy GUI for Excel data viewing
- **`python_requirements.txt`** - List of Python dependencies needed for the application
- **`data.xlsx`** - Sample Excel data file with employee information

## Features

- 📊 Load and display Excel files (.xlsx, .xls)
- 🖥️ Desktop GUI built with Kivy framework
- 📱 Responsive layout with scrollable data view
- 🔄 Sample data loading for testing
- 📁 File chooser dialog for selecting Excel files
- 🧹 Clear data functionality

## Setup Instructions

### 1. Install Python Dependencies
```bash
pip install -r python_requirements.txt
```

### 2. Run the Application
```bash
python main.py
```

### 3. Using the Application

1. **Load Sample Data**: Click "Load Sample Data" to view the included `data.xlsx` file
2. **Load Your Own File**: Click "Load Excel File" to browse and select your own Excel file
3. **Clear Data**: Click "Clear Data" to remove all displayed information

## Dependencies Included

- **Kivy 2.2.0** - Cross-platform Python framework for GUI development
- **Pandas 2.0.3** - Data manipulation and analysis library
- **OpenPyXL 3.1.2** - Library for reading/writing Excel files
- **XlsxWriter 3.1.2** - Library for creating Excel files

## Sample Data

The included `data.xlsx` file contains employee information with the following columns:
- Name, Age, Department, Salary, Join_Date, Performance_Rating, City

## Notes

- The application displays up to 100 rows for performance optimization
- Supports both .xlsx and .xls file formats
- Error handling is included for file loading issues
- The GUI is responsive and includes scroll functionality for large datasets