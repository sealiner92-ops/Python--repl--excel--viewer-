"""
Script to create a properly formatted Excel file with sample data
"""
import pandas as pd

# Create sample employee data
data = {
    'Name': [
        'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Wilson', 'Eve Davis',
        'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Wilson'
    ],
    'Age': [28, 35, 42, 31, 26, 39, 33, 45, 29, 37],
    'Department': [
        'Engineering', 'Marketing', 'Sales', 'HR', 'Engineering',
        'Finance', 'Marketing', 'Sales', 'Engineering', 'Operations'
    ],
    'Salary': [75000, 65000, 58000, 62000, 78000, 72000, 68000, 61000, 76000, 59000],
    'Join_Date': [
        '2020-01-15', '2019-06-20', '2018-03-10', '2021-09-05', '2022-02-28',
        '2017-11-12', '2020-08-03', '2016-05-20', '2021-12-01', '2019-09-15'
    ],
    'Performance_Rating': [4.5, 4.2, 3.8, 4.7, 4.3, 4.1, 4.6, 3.9, 4.4, 4.0],
    'City': [
        'San Francisco', 'New York', 'Chicago', 'Austin', 'Seattle',
        'Boston', 'Los Angeles', 'Miami', 'Denver', 'Portland'
    ]
}

# Create DataFrame
df = pd.DataFrame(data)

# Convert Join_Date to datetime
df['Join_Date'] = pd.to_datetime(df['Join_Date'])

# Save to Excel file
df.to_excel('data.xlsx', index=False, sheet_name='Employees')

print("✅ Created data.xlsx successfully!")
print(f"📊 File contains {len(df)} rows and {len(df.columns)} columns")
print("\nColumns:", list(df.columns))