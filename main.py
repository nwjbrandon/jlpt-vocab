import pandas as pd

def create_dataset(filename):
    df = pd.DataFrame({
        "kangi": [],
        "hiragana": [],
        "meaning": [],
    })

    df.to_csv(filename, sep=",", index=False)

def read_dataset(filename):
    df = pd.read_csv(filename)
    print(df.head())

if __name__ == "__main__":
    filename = "nihongo-no-mori.csv"
    # create_dataset(filename)
    read_dataset(filename)