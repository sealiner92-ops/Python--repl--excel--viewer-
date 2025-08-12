"""
Runner script for the Kivy Excel Viewer application
This script handles setup and launches the main application
"""
import sys
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = ['kivy', 'pandas', 'openpyxl']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"  - {package}")
        print("\n📦 Install missing packages with:")
        print("pip install " + " ".join(missing_packages))
        return False
    
    print("✅ All dependencies are installed!")
    return True

def create_sample_data():
    """Create sample Excel data if it doesn't exist"""
    if not Path('data.xlsx').exists():
        print("📊 Creating sample Excel data...")
        try:
            exec(open('create_excel_data.py').read())
        except Exception as e:
            print(f"⚠️ Could not create sample data: {e}")
            return False
    else:
        print("✅ Sample data file exists!")
    return True

def main():
    """Main runner function"""
    print("🐍 Starting Kivy Excel Viewer Application")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        return 1
    
    # Create sample data
    create_sample_data()
    
    print("\n🚀 Launching application...")
    print("=" * 50)
    
    # Run the main application
    try:
        import main
        main.ExcelViewerApp().run()
    except Exception as e:
        print(f"❌ Error running application: {e}")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())