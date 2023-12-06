import json

import pandas as pd

csv_filenames = [
    "jlpt/goi/n3/nihongo-no-mori.csv",
    "jlpt/goi/n2/nihongo-no-mori.csv",
]

dfs = []
for csv_filename in csv_filenames:
    df = pd.read_csv(csv_filename, encoding="utf-8")
    dfs.append(df)

df = pd.concat(dfs)
df = df.drop_duplicates(subset="kanji", keep="first")
records = json.loads(df.to_json(orient="records"))

json_filename = "frontend/src/data/vocab.json"
with open(json_filename, "w", encoding="utf8") as f:
    json.dump(records, f, indent=2, ensure_ascii=False)
