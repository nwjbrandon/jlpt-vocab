import pandas as pd

def create_dataset(filename):
    df = pd.DataFrame({
        "kangi": [],
        "hiragana": [],
        "meaning": [],
    })

    df.to_csv(filename, sep=",", index=False)

if __name__ == "__main__":
    filename = "nihongo-no-mori.csv"
    create_dataset(filename)