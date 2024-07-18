import asyncio
from scripts.models_page.models_package.get_daily_vs_active_sessions import get_daily_and_active_sessions
from scripts.models_page.models_package.get_model_provider_table import get_all_table_data


async def get_model_data(model_id: str):
    all_models_chart_data = await get_daily_and_active_sessions()
    all_models_table_data = await get_all_table_data()

    chart_data = None
    table_data = []
    model_name = None

    # Filter the chart data for the given model id
    for model, data in all_models_chart_data.items():
        if data.get('model_id') == model_id:
            chart_data = data
            model_name = model
            break

    # Filter the table data for the given model id
    for name, data in all_models_table_data.items():
        for entry in data.get('tableData', []):
            if entry.get('model_id') == model_id:
                table_data.append(entry)
                if not model_name:
                    model_name = entry.get('model_name')

    if not model_name:
        model_name = 'Unknown'  # Fallback if model_name couldn't be found

    # Create the JSON return structure
    result = {
        model_name: {
            "model_id": model_id,
            "graphData": chart_data,
            "tableData": table_data
        }
    }

    return result
