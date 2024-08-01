import pandas as pd
from datetime import datetime
import asyncio
import os


async def get_circulating_supply_json():
    # Use an absolute path for the CSV file
    csv_file = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                            '../../../project_data/circulating_supply.csv'))

    if not os.path.exists(csv_file):
        raise FileNotFoundError(f"The file {csv_file} does not exist.")

    loop = asyncio.get_event_loop()

    df = await loop.run_in_executor(None, pd.read_csv, csv_file)

    df['Date'] = pd.to_datetime(df['Date'], format='%b %d, %Y')

    df['Circulating Supply'] = df['Circulating Supply'].str.replace(',', '').astype(int)

    # Determine the current date
    current_date = datetime.now().date()

    # Filter records from February 8, 2024, to the current date
    start_date = datetime.strptime('Feb 8, 2024', '%b %d, %Y').date()
    filtered_df = df[(df['Date'].dt.date >= start_date) & (df['Date'].dt.date <= current_date)]

    json_data = {
        "circulating_supply": [
            {"date": date.strftime('%d/%m/%Y'), "value": supply}
            for date, supply in zip(filtered_df['Date'], filtered_df['Circulating Supply'])
        ]
    }

    return json_data
