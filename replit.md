# Overview

This is a Python REPL (Read-Eval-Print Loop) web application that allows users to execute Python code in an interactive environment. The application features a modern web interface built with React and TypeScript, with a Node.js/Express backend that handles Python code execution. Users can write Python code in a built-in editor, execute it, and view the output in real-time. The application supports session management to maintain execution history and provides both desktop and mobile-responsive interfaces.

Additionally, the project now includes a complete Kivy + Excel desktop application with sample project files for Python development, demonstrating how to build GUI applications that work with Excel data.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Responsive Design**: Mobile-first approach with dedicated mobile components and desktop layouts

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with session-based code execution
- **Code Execution**: Python subprocess spawning with timeout protection (10 seconds)
- **Development**: Hot module replacement via Vite integration in development mode
- **Build Process**: ESBuild for server bundling, Vite for client bundling

## Data Storage Solutions
- **Primary Storage**: In-memory storage using Map data structures for sessions and executions
- **Database Ready**: Drizzle ORM configured for PostgreSQL with schema definitions and migrations support
- **Schema Design**: Two main entities - sessions (for grouping executions) and executions (for individual code runs)
- **Session Management**: UUID-based session identification with execution history tracking

## Authentication and Authorization
- **Current State**: No authentication implemented - open access model
- **Session Isolation**: Each session is independent with unique UUID identification
- **Security Considerations**: Python execution is sandboxed with timeout limits to prevent resource abuse

## Code Editor Features
- **Custom Editor**: Built-in textarea-based code editor with syntax awareness
- **Keyboard Shortcuts**: Ctrl+Enter for code execution, Tab for indentation
- **Line Numbers**: Dynamic line number generation and display
- **Mobile Support**: Touch-friendly interface with responsive design

## Execution Environment
- **Python Integration**: Direct Python 3 subprocess execution
- **Output Handling**: Separate capture of stdout and stderr streams
- **Error Management**: Comprehensive error handling with user-friendly error messages
- **Execution History**: Persistent storage of all code executions within sessions

# External Dependencies

## Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for potential database integration
- **drizzle-orm**: Type-safe ORM for database operations and schema management
- **express**: Web application framework for the backend API server

## Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, and React development tools
- **@tanstack/react-query**: Server state management and caching solution
- **wouter**: Lightweight routing library for single-page application navigation

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, tooltips, etc.)
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating variant-based component APIs
- **lucide-react**: Icon library providing consistent iconography

## Development Tools
- **Vite**: Frontend build tool and development server with HMR support
- **TypeScript**: Static type checking for both frontend and backend code
- **ESBuild**: Fast JavaScript bundler for production server builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for better debugging experience

## Form and Validation
- **react-hook-form**: Forms library for handling user input and validation
- **@hookform/resolvers**: Validation resolvers for integration with schema validation
- **zod**: TypeScript-first schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library for timestamp formatting
- **clsx**: Utility for constructing className strings conditionally
- **nanoid**: Secure URL-friendly unique string ID generator

## Database and Storage
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not actively used)
- **drizzle-kit**: CLI tools for database migrations and schema management

# Python Desktop Application Files

The project includes a complete Kivy-based desktop application for Excel data viewing:

## Application Files
- **`main.py`** - Complete Kivy GUI application for viewing Excel data with file chooser, data display, and error handling
- **`python_requirements.txt`** - Python dependencies list (kivy, pandas, openpyxl, xlsxwriter)
- **`data.xlsx`** - Sample Excel file with employee data (10 rows, 7 columns)
- **`create_excel_data.py`** - Utility script to generate properly formatted Excel sample data
- **`run_python_app.py`** - Application launcher with dependency checking and setup
- **`README_Python_App.md`** - Complete documentation for the Python desktop application

## Python Dependencies Installed
- **Kivy 2.3.1** - Cross-platform GUI framework for desktop applications
- **Pandas 2.3.1** - Data manipulation and Excel file processing
- **OpenPyXL 3.1.5** - Excel file reading/writing support
- **NumPy 2.3.2** - Numerical computing support for pandas