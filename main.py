"""
Kivy + Excel Data Viewer Application
A simple desktop application that reads and displays Excel data using Kivy framework.
"""

import kivy
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.filechooser import FileChooserIconView
from kivy.uix.popup import Popup
from kivy.uix.gridlayout import GridLayout
from kivy.uix.scrollview import ScrollView
import pandas as pd
from pathlib import Path

kivy.require('2.0.0')

class ExcelViewerApp(App):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.data = None
        self.current_file = None

    def build(self):
        """Build the main application interface"""
        self.title = "Excel Data Viewer"
        
        # Main layout
        main_layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        # Header
        header = Label(
            text='Excel Data Viewer',
            size_hint=(1, 0.1),
            font_size='20sp',
            bold=True
        )
        main_layout.add_widget(header)
        
        # Button layout
        button_layout = BoxLayout(size_hint=(1, 0.1), spacing=10)
        
        # Load file button
        load_btn = Button(
            text='Load Excel File',
            size_hint=(0.3, 1)
        )
        load_btn.bind(on_press=self.show_file_chooser)
        button_layout.add_widget(load_btn)
        
        # Load sample data button
        sample_btn = Button(
            text='Load Sample Data',
            size_hint=(0.3, 1)
        )
        sample_btn.bind(on_press=self.load_sample_data)
        button_layout.add_widget(sample_btn)
        
        # Clear data button
        clear_btn = Button(
            text='Clear Data',
            size_hint=(0.3, 1)
        )
        clear_btn.bind(on_press=self.clear_data)
        button_layout.add_widget(clear_btn)
        
        main_layout.add_widget(button_layout)
        
        # File info label
        self.file_info = Label(
            text='No file loaded',
            size_hint=(1, 0.05),
            font_size='14sp'
        )
        main_layout.add_widget(self.file_info)
        
        # Data display area
        self.data_scroll = ScrollView(size_hint=(1, 0.75))
        self.data_layout = GridLayout(
            cols=1,
            size_hint_y=None,
            spacing=5
        )
        self.data_layout.bind(minimum_height=self.data_layout.setter('height'))
        self.data_scroll.add_widget(self.data_layout)
        main_layout.add_widget(self.data_scroll)
        
        # Load sample data on startup
        self.load_sample_data()
        
        return main_layout

    def show_file_chooser(self, instance):
        """Show file chooser dialog"""
        content = BoxLayout(orientation='vertical')
        
        file_chooser = FileChooserIconView(
            filters=['*.xlsx', '*.xls']
        )
        content.add_widget(file_chooser)
        
        button_layout = BoxLayout(size_hint=(1, 0.1), spacing=10)
        
        load_btn = Button(text='Load')
        cancel_btn = Button(text='Cancel')
        
        button_layout.add_widget(load_btn)
        button_layout.add_widget(cancel_btn)
        content.add_widget(button_layout)
        
        popup = Popup(
            title='Choose Excel File',
            content=content,
            size_hint=(0.8, 0.8)
        )
        
        def load_file(btn):
            if file_chooser.selection:
                self.load_excel_file(file_chooser.selection[0])
            popup.dismiss()
        
        def cancel(btn):
            popup.dismiss()
        
        load_btn.bind(on_press=load_file)
        cancel_btn.bind(on_press=cancel)
        
        popup.open()

    def load_excel_file(self, filepath):
        """Load Excel file and display data"""
        try:
            self.data = pd.read_excel(filepath)
            self.current_file = filepath
            self.display_data()
            self.file_info.text = f'Loaded: {Path(filepath).name} ({len(self.data)} rows)'
        except Exception as e:
            self.show_error(f'Error loading file: {str(e)}')

    def load_sample_data(self, instance=None):
        """Load sample data if data.xlsx exists, otherwise create sample data"""
        try:
            if Path('data.xlsx').exists():
                self.data = pd.read_excel('data.xlsx')
                self.current_file = 'data.xlsx'
                self.file_info.text = f'Loaded: data.xlsx ({len(self.data)} rows)'
            else:
                # Create sample data
                self.data = pd.DataFrame({
                    'Name': ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Wilson', 'Eve Davis'],
                    'Age': [28, 35, 42, 31, 26],
                    'Department': ['Engineering', 'Marketing', 'Sales', 'HR', 'Engineering'],
                    'Salary': [75000, 65000, 58000, 62000, 78000],
                    'Join_Date': ['2020-01-15', '2019-06-20', '2018-03-10', '2021-09-05', '2022-02-28']
                })
                self.current_file = 'Sample Data'
                self.file_info.text = 'Loaded: Sample Data (5 rows)'
            
            self.display_data()
        except Exception as e:
            self.show_error(f'Error loading sample data: {str(e)}')

    def display_data(self):
        """Display the loaded data in the UI"""
        if self.data is None:
            return
        
        # Clear existing data
        self.data_layout.clear_widgets()
        
        # Add headers
        header_layout = BoxLayout(size_hint_y=None, height=40, spacing=2)
        for col in self.data.columns:
            header = Label(
                text=str(col),
                size_hint_y=None,
                height=40,
                bold=True,
                color=(1, 1, 1, 1)
            )
            header_layout.add_widget(header)
        self.data_layout.add_widget(header_layout)
        
        # Add data rows (limit to first 100 rows for performance)
        display_data = self.data.head(100)
        for _, row in display_data.iterrows():
            row_layout = BoxLayout(size_hint_y=None, height=30, spacing=2)
            for value in row:
                cell = Label(
                    text=str(value),
                    size_hint_y=None,
                    height=30,
                    text_size=(None, None),
                    halign='left'
                )
                row_layout.add_widget(cell)
            self.data_layout.add_widget(row_layout)
        
        # Show data summary
        if len(self.data) > 100:
            summary = Label(
                text=f'Showing first 100 rows of {len(self.data)} total rows',
                size_hint_y=None,
                height=30,
                italic=True
            )
            self.data_layout.add_widget(summary)

    def clear_data(self, instance):
        """Clear the displayed data"""
        self.data = None
        self.current_file = None
        self.data_layout.clear_widgets()
        self.file_info.text = 'No file loaded'
        
        # Add empty state message
        empty_label = Label(
            text='No data to display\nClick "Load Excel File" or "Load Sample Data" to get started',
            size_hint_y=None,
            height=100,
            halign='center'
        )
        self.data_layout.add_widget(empty_label)

    def show_error(self, message):
        """Show error popup"""
        popup = Popup(
            title='Error',
            content=Label(text=message),
            size_hint=(0.6, 0.4)
        )
        popup.open()


if __name__ == '__main__':
    ExcelViewerApp().run()