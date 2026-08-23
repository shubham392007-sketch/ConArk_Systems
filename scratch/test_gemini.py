import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath('src'))

from conark.gemini.service import GeminiService

async def main():
    service = GeminiService()
    payload = {
        'target_model': 'performance',
        'predictions': {'performance': {'performance_score': 'EXCELLENT'}},
        'input_data': {'temperature': 25.0, 'humidity': 55.0, 'vibration_level': 2.1}
    }
    result = await service.generate_construction_report(payload)
    print("Gemini Status:", result.status)
    print("Gemini Message:", result.message)
    if result.report:
        print("Gemini Executive Summary:", result.report.executive_summary[:120])

if __name__ == "__main__":
    asyncio.run(main())
