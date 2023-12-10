import json
import tkinter as tk
from datetime import datetime
from tkinter import ttk

import pandas as pd

CSV_FILENAME = "jlpt/goi/n3/new-kanzen.csv"


class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.is_ctlr_pressed = False
        self.last_save_timestamp = datetime.now()

        self.table_headers = ["kanji", "hiragana", "meaning"]
        self.unique_words = set()
        self.records = self.read_csv()

        self.tab_cnt = 0
        self.n_tab_cnts = 3
        self.kanji_textfield = None
        self.hiragana_textfield = None
        self.meaning_textfield = None

        self.create_kanji_textfield()
        self.create_hiragana_textfield()
        self.create_meaning_textfield()
        self.handle_tab_event(None)

        self.create_add_button()
        self.create_last_save_timestamp_status_label()
        self.create_table()
        self.keyboard_settings()

    def create_kanji_textfield(self):
        self.kanji_label = tk.Label(self.master, text="Kangi:")
        self.kanji_label.place(x=screen_width // 4 * 3 - 100, y=screen_height // 5)
        self.kanji_textfield = tk.Text(
            self.master, height=2, width=20, bg="#fff", fg="#000", pady=5, padx=5, insertbackground="#000"
        )
        self.kanji_textfield.place(x=screen_width // 4 * 3, y=screen_height // 5)

    def create_hiragana_textfield(self):
        self.hiragana_label = tk.Label(self.master, text="Hiragana:")
        self.hiragana_label.place(x=screen_width // 4 * 3 - 100, y=screen_height // 5 * 2)
        self.hiragana_textfield = tk.Text(
            self.master, height=2, width=20, bg="#fff", fg="#000", pady=5, padx=5, insertbackground="#000"
        )
        self.hiragana_textfield.place(x=screen_width // 4 * 3, y=screen_height // 5 * 2)

    def create_meaning_textfield(self):
        self.meaning_label = tk.Label(self.master, text="Meaning:")
        self.meaning_label.place(x=screen_width // 4 * 3 - 100, y=screen_height // 5 * 3)
        self.meaning_textfield = tk.Text(
            self.master, height=2, width=20, bg="#fff", fg="#000", pady=5, padx=5, insertbackground="#000"
        )
        self.meaning_textfield.place(x=screen_width // 4 * 3, y=screen_height // 5 * 3)

    def create_add_button(self):
        self.add_button = tk.Button(self.master, text="Add", command=self.add_record, padx=5, pady=5)
        self.add_button.place(x=screen_width // 4 * 3 + 80, y=screen_height // 5 * 3 + 100)

    def create_last_save_timestamp_status_label(self):
        self.last_saved_timestamp_label = tk.Label(self.master, text=f"Last Saved: {self.last_save_timestamp}")
        self.last_saved_timestamp_label.place(x=screen_width // 4 * 3, y=screen_height // 5 * 3 + 150)

    def read_csv(self) -> list:
        records = json.loads(pd.read_csv(CSV_FILENAME, encoding="utf-8").to_json(orient="records"))
        for record in records:
            self.unique_words.add(record["kanji"])
        return records

    def create_table(self):
        # https://stackoverflow.com/questions/75289188/trying-to-make-a-scrollable-table-with-tkinter
        self.container = ttk.Frame(self.master)
        self.canvas = tk.Canvas(self.container, width=400, height=600)
        self.vscrollbar = ttk.Scrollbar(self.container, orient="vertical", command=self.canvas.yview)
        self.hscrollbar = ttk.Scrollbar(self.container, orient="horizontal", command=self.canvas.xview)
        self.scrollable_frame = ttk.Frame(self.canvas)
        self.scrollable_frame.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))

        self.canvas.create_window(0, 0, window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=self.vscrollbar.set)
        self.canvas.configure(xscrollcommand=self.hscrollbar.set)

        self.add_table_content()

        self.container.grid()
        self.canvas.grid()
        self.vscrollbar.grid(row=0, column=1, sticky="ns")
        self.hscrollbar.grid(row=1, column=0, sticky="ew")
        self.container.place(x=screen_width / 10, y=screen_height // 10)

    def add_table_content(self):
        for row_idx in range(len(self.records)):
            self.add_table_row(row_idx)

    def add_table_row(self, row_idx):
        for header in self.table_headers:
            text = self.records[row_idx][header]
            current_entry = tk.Entry(self.scrollable_frame, width=10, justify="center")
            current_entry.insert(0, text)
            current_entry.configure(state="disabled", disabledforeground="white")
            current_entry.grid(row=row_idx, column=self.table_headers.index(header))

    def keyboard_settings(self):
        self.kanji_textfield.bind("<Tab>", lambda e: self.handle_tab_event(e))
        self.hiragana_textfield.bind("<Tab>", lambda e: self.handle_tab_event(e))
        self.meaning_textfield.bind("<Tab>", lambda e: self.handle_tab_event(e))

        self.master.bind("<Escape>", lambda e: self.close_app(e))
        self.master.bind("<Control-s>", lambda e: self.save_records(e))
        self.master.bind("<Control-a>", lambda e: self.add_record())

    def handle_tab_event(self, e):
        mapping = {0: self.kanji_textfield, 1: self.hiragana_textfield, 2: self.meaning_textfield}
        textfield = mapping[self.tab_cnt]
        textfield.focus()
        self.tab_cnt = (self.tab_cnt + 1) % self.n_tab_cnts

    def save_records(self, e):
        df = pd.DataFrame(self.records)
        df.to_csv(CSV_FILENAME, encoding="utf-8", index=False, sep=",")
        self.last_save_timestamp = datetime.now()
        self.last_saved_timestamp_label.config(text=f"Last Saved: {self.last_save_timestamp}")

    def add_record(self):
        kanji = self.kanji_textfield.get("1.0", "end-1c").strip()
        hiragana = self.hiragana_textfield.get("1.0", "end-1c").strip()
        meaning = self.meaning_textfield.get("1.0", "end-1c").strip()

        if kanji == "" or hiragana == "" or meaning == "" or kanji in self.unique_words:
            return

        record = {
            "kanji": kanji,
            "hiragana": hiragana,
            "meaning": meaning,
        }
        self.records.append(record)
        self.unique_words.add(kanji)
        self.add_table_row(len(self.records) - 1)

        self.kanji_textfield.delete("1.0", "end-1c")
        self.hiragana_textfield.delete("1.0", "end-1c")
        self.meaning_textfield.delete("1.0", "end-1c")

    def close_app(self, e):
        self.save_records(None)
        self.master.destroy()


if __name__ == "__main__":
    root = tk.Tk()
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    root.geometry("%dx%d+0+0" % (screen_width, screen_height))

    app = Application(master=root)
    app_name = CSV_FILENAME
    app.master.title(app_name)
    app.mainloop()
