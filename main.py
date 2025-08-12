"""
Kivy + Excel Data Viewer Application with Search
A desktop application that reads Excel data and provides search functionality using Kivy framework.
"""

import pandas as pd
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.textinput import TextInput
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.filechooser import FileChooserIconView
from kivy.uix.popup import Popup
from pathlib import Path
import kivy

kivy.require('2.0.0')

class ExcelApp(App):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.df = None
        self.current_file = None
        self.load_sample_data()

    def build(self):
        """Build the main application interface with search functionality"""
        self.title = "Excel Data Viewer with Search"
        
        # Main layout
        layout = BoxLayout(orientation="vertical", padding=10, spacing=10)
        
        # Header
        header = Label(
            text='Excel Data Viewer with Search',
            size_hint=(1, 0.08),
            font_size='20sp',
            bold=True
        )
        layout.add_widget(header)
        
        # Button layout for file operations
        button_layout = BoxLayout(size_hint=(1, 0.08), spacing=10)
        
        load_btn = Button(text='Load Excel File', size_hint=(0.33, 1))
        load_btn.bind(on_press=self.show_file_chooser)
        button_layout.add_widget(load_btn)
        
        sample_btn = Button(text='Load Sample Data', size_hint=(0.33, 1))
        sample_btn.bind(on_press=self.load_sample_data)
        button_layout.add_widget(sample_btn)
        
        clear_btn = Button(text='Clear Data', size_hint=(0.33, 1))
        clear_btn.bind(on_press=self.clear_data)
        button_layout.add_widget(clear_btn)
        
        layout.add_widget(button_layout)
        
        # File info
        self.file_info = Label(
            text='Sample data loaded',
            size_hint=(1, 0.04),
            font_size='14sp'
        )
        layout.add_widget(self.file_info)
        
        # Search input
        self.search_input = TextInput(
            hint_text="Search across all columns...", 
            multiline=False,
            size_hint=(1, 0.08),
            font_size='16sp'
        )
        self.search_input.bind(text=lambda instance, value: self.update_results(value))
        layout.add_widget(self.search_input)
        
        # Results area
        self.results_layout = GridLayout(cols=1, size_hint_y=None, spacing=2)
        self.results_layout.bind(minimum_height=self.results_layout.setter('height'))
        
        scroll = ScrollView(size_hint=(1, 0.72))
        scroll.add_widget(self.results_layout)
        layout.add_widget(scroll)
        
        # Initial display
        self.update_results("")
        
        return layout

    def update_results(self, search_term):
        """Update the display based on search term"""
        self.results_layout.clear_widgets()
        
        if self.df is None:
            empty_label = Label(
                text='No data loaded\nClick "Load Sample Data" or "Load Excel File"',
                size_hint_y=None,
                height=100,
                halign='center'
            )
            self.results_layout.add_widget(empty_label)
            return
        
        # Filter data based on search term
        search_term = search_term.lower().strip()
        if search_term:
            # Search across all columns
            filtered = self.df[self.df.apply(
                lambda row: row.astype(str).str.lower().str.contains(search_term, na=False).any(), 
                axis=1
            )]
        else:
            # Show all data if no search term
            filtered = self.df
        
        # Add column headers
        if not filtered.empty:
            header_layout = BoxLayout(size_hint_y=None, height=35, spacing=2)
            for col in self.df.columns:
                header = Label(
                    text=str(col),
                    size_hint_y=None,
                    height=35,
                    bold=True,
                    color=(0.2, 0.6, 1, 1)  # Blue color for headers
                )
                header_layout.add_widget(header)
            self.results_layout.add_widget(header_layout)
        
        # Add filtered rows
        row_count = 0
        max_display = 50  # Limit for performance
        
        for _, row in filtered.iterrows():
            if row_count >= max_display:
                more_label = Label(
                    text=f'... and {len(filtered) - max_display} more results. Refine your search to see more.',
                    size_hint_y=None,
                    height=40,
                    italic=True,
                    color=(0.7, 0.7, 0.7, 1)
                )
                self.results_layout.add_widget(more_label)
                break
                
            row_layout = BoxLayout(size_hint_y=None, height=30, spacing=2)
            for value in row:
                cell = Label(
                    text=str(value),
                    size_hint_y=None,
                    height=30,
                    text_size=(150, None),
                    halign='left'
                )
                row_layout.add_widget(cell)
            self.results_layout.add_widget(row_layout)
            row_count += 1
        
        # Show results summary
        if filtered.empty and search_term:
            no_results = Label(
                text=f'No results found for "{search_term}"',
                size_hint_y=None,
                height=50,
                color=(1, 0.5, 0.5, 1)
            )
            self.results_layout.add_widget(no_results)
        elif not search_term and not self.df.empty:
            summary = Label(
                text=f'Showing all {len(filtered)} rows',
                size_hint_y=None,
                height=30,
                italic=True,
                color=(0.7, 0.7, 0.7, 1)
            )
            self.results_layout.add_widget(summary)

    def load_sample_data(self, instance=None):
        """Load sample data"""
        try:
            if Path('data.xlsx').exists():
                self.df = pd.read_excel('data.xlsx')
                self.current_file = 'data.xlsx'
                self.file_info.text = f'Loaded: data.xlsx ({len(self.df)} rows, {len(self.df.columns)} columns)'
            else:
                # Create sample data
                self.df = pd.DataFrame({
                    'Name': ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Wilson', 'Eve Davis'],
                    'Age': [28, 35, 42, 31, 26],
                    'Department': ['Engineering', 'Marketing', 'Sales', 'HR', 'Engineering'],
                    'Salary': [75000, 65000, 58000, 62000, 78000],
                    'Join_Date': ['2020-01-15', '2019-06-20', '2018-03-10', '2021-09-05', '2022-02-28']
                })
                self.current_file = 'Sample Data'
                self.file_info.text = 'Loaded: Sample Data (5 rows, 5 columns)'
            
            self.update_results("")  # Refresh display
            self.search_input.text = ""  # Clear search
        except Exception as e:
            self.show_error(f'Error loading sample data: {str(e)}')

    def show_file_chooser(self, instance):
        """Show file chooser dialog"""
        content = BoxLayout(orientation='vertical')
        
        file_chooser = FileChooserIconView(filters=['*.xlsx', '*.xls'])
        content.add_widget(file_chooser)
        
        button_layout = BoxLayout(size_hint=(1, 0.1), spacing=10)
        load_btn = Button(text='Load')
        cancel_btn = Button(text='Cancel')
        button_layout.add_widget(load_btn)
        button_layout.add_widget(cancel_btn)
        content.add_widget(button_layout)
        
        popup = Popup(title='Choose Excel File', content=content, size_hint=(0.8, 0.8))
        
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
        """Load Excel file"""
        try:
            self.df = pd.read_excel(filepath)
            self.current_file = filepath
            self.file_info.text = f'Loaded: {Path(filepath).name} ({len(self.df)} rows, {len(self.df.columns)} columns)'
            self.update_results("")
            self.search_input.text = ""
        except Exception as e:
            self.show_error(f'Error loading file: {str(e)}')

    def clear_data(self, instance):
        """Clear data"""
        self.df = None
        self.current_file = None
        self.file_info.text = 'No data loaded'
        self.search_input.text = ""
        self.update_results("")

    def show_error(self, message):
        """Show error popup"""
        popup = Popup(
            title='Error',
            content=Label(text=message),
            size_hint=(0.6, 0.4)
        )
        popup.open()


if __name__ == "__main__":
    ExcelApp().run()