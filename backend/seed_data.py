import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample car data
sample_cars = [
    {
        "CarID": "car-001",
        "ArabaMarka": "Toyota",
        "CarModel": "Corolla",
        "CarPack": "1.6 Executive",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1598,
        "CarHorsePower": 132,
        "CarType": "Sedan",
        "CarTopSpeed": 190,
        "CarAcceleration": 10.5,
        "CarTransmission": "Otomatik",
        "CarEconomy": 6.2,
        "CarWeight": 1300,
        "CarHeight": 1435,
        "CarWidth": 1780,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 470,
        "CarBrakeMetre": 38,
        "CarPrice": 1250000,
        "CarPhotos": "https://images.unsplash.com/photo-1623869675781-80aa31bfa4e8?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-002",
        "ArabaMarka": "BMW",
        "CarModel": "3 Serisi",
        "CarPack": "320i M Sport",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1998,
        "CarHorsePower": 184,
        "CarType": "Sedan",
        "CarTopSpeed": 230,
        "CarAcceleration": 7.1,
        "CarTransmission": "Otomatik",
        "CarEconomy": 6.8,
        "CarWeight": 1540,
        "CarHeight": 1440,
        "CarWidth": 1827,
        "CarDriveTrain": "Arkadan İtiş",
        "CarBaggageLT": 480,
        "CarBrakeMetre": 35,
        "CarPrice": 2850000,
        "CarPhotos": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-003",
        "ArabaMarka": "Mercedes-Benz",
        "CarModel": "C-Class",
        "CarPack": "C200 AMG",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1496,
        "CarHorsePower": 204,
        "CarType": "Sedan",
        "CarTopSpeed": 240,
        "CarAcceleration": 7.3,
        "CarTransmission": "Otomatik",
        "CarEconomy": 7.1,
        "CarWeight": 1640,
        "CarHeight": 1438,
        "CarWidth": 1820,
        "CarDriveTrain": "Arkadan İtiş",
        "CarBaggageLT": 455,
        "CarBrakeMetre": 36,
        "CarPrice": 3200000,
        "CarPhotos": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-004",
        "ArabaMarka": "Volkswagen",
        "CarModel": "Golf",
        "CarPack": "1.5 TSI Highline",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1498,
        "CarHorsePower": 150,
        "CarType": "Hatchback",
        "CarTopSpeed": 220,
        "CarAcceleration": 8.5,
        "CarTransmission": "Otomatik",
        "CarEconomy": 5.9,
        "CarWeight": 1320,
        "CarHeight": 1456,
        "CarWidth": 1789,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 380,
        "CarBrakeMetre": 37,
        "CarPrice": 1450000,
        "CarPhotos": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-005",
        "ArabaMarka": "Audi",
        "CarModel": "A4",
        "CarPack": "35 TFSI S-Line",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1984,
        "CarHorsePower": 150,
        "CarType": "Sedan",
        "CarTopSpeed": 225,
        "CarAcceleration": 8.8,
        "CarTransmission": "Otomatik",
        "CarEconomy": 6.5,
        "CarWeight": 1495,
        "CarHeight": 1427,
        "CarWidth": 1842,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 460,
        "CarBrakeMetre": 36,
        "CarPrice": 2650000,
        "CarPhotos": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-006",
        "ArabaMarka": "Honda",
        "CarModel": "Civic",
        "CarPack": "1.5 VTEC Turbo Executive",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1498,
        "CarHorsePower": 182,
        "CarType": "Sedan",
        "CarTopSpeed": 215,
        "CarAcceleration": 8.2,
        "CarTransmission": "Otomatik",
        "CarEconomy": 6.3,
        "CarWeight": 1360,
        "CarHeight": 1415,
        "CarWidth": 1802,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 430,
        "CarBrakeMetre": 37,
        "CarPrice": 1550000,
        "CarPhotos": "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-007",
        "ArabaMarka": "Ford",
        "CarModel": "Focus",
        "CarPack": "1.5 EcoBoost Titanium",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1498,
        "CarHorsePower": 150,
        "CarType": "Hatchback",
        "CarTopSpeed": 210,
        "CarAcceleration": 9.0,
        "CarTransmission": "Otomatik",
        "CarEconomy": 6.1,
        "CarWeight": 1350,
        "CarHeight": 1470,
        "CarWidth": 1825,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 375,
        "CarBrakeMetre": 38,
        "CarPrice": 1350000,
        "CarPhotos": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-008",
        "ArabaMarka": "Renault",
        "CarModel": "Megane",
        "CarPack": "1.6 Icon",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1598,
        "CarHorsePower": 115,
        "CarType": "Hatchback",
        "CarTopSpeed": 195,
        "CarAcceleration": 11.2,
        "CarTransmission": "Manuel",
        "CarEconomy": 5.8,
        "CarWeight": 1280,
        "CarHeight": 1447,
        "CarWidth": 1814,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 384,
        "CarBrakeMetre": 39,
        "CarPrice": 1100000,
        "CarPhotos": "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-009",
        "ArabaMarka": "Hyundai",
        "CarModel": "i30",
        "CarPack": "1.5 T-GDI Elite Plus",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1482,
        "CarHorsePower": 160,
        "CarType": "Hatchback",
        "CarTopSpeed": 205,
        "CarAcceleration": 8.4,
        "CarTransmission": "Otomatik",
        "CarEconomy": 6.0,
        "CarWeight": 1310,
        "CarHeight": 1455,
        "CarWidth": 1795,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 395,
        "CarBrakeMetre": 38,
        "CarPrice": 1280000,
        "CarPhotos": "https://images.unsplash.com/photo-1583267746897-83cf90249611?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-010",
        "ArabaMarka": "Peugeot",
        "CarModel": "308",
        "CarPack": "1.2 PureTech Allure",
        "CarYear": 2024,
        "CarFuelType": "Benzin",
        "CarEngineCapacity": 1199,
        "CarHorsePower": 130,
        "CarType": "Hatchback",
        "CarTopSpeed": 200,
        "CarAcceleration": 9.8,
        "CarTransmission": "Otomatik",
        "CarEconomy": 5.6,
        "CarWeight": 1270,
        "CarHeight": 1440,
        "CarWidth": 1805,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 412,
        "CarBrakeMetre": 38,
        "CarPrice": 1180000,
        "CarPhotos": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-011",
        "ArabaMarka": "Tesla",
        "CarModel": "Model 3",
        "CarPack": "Long Range AWD",
        "CarYear": 2024,
        "CarFuelType": "Elektrik",
        "CarEngineCapacity": 0,
        "CarHorsePower": 450,
        "CarType": "Sedan",
        "CarTopSpeed": 233,
        "CarAcceleration": 4.4,
        "CarTransmission": "Otomatik",
        "CarEconomy": 1.5,
        "CarWeight": 1847,
        "CarHeight": 1443,
        "CarWidth": 1850,
        "CarDriveTrain": "4x4",
        "CarBaggageLT": 542,
        "CarBrakeMetre": 32,
        "CarPrice": 3500000,
        "CarPhotos": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    },
    {
        "CarID": "car-012",
        "ArabaMarka": "Volvo",
        "CarModel": "S60",
        "CarPack": "B4 Momentum",
        "CarYear": 2024,
        "CarFuelType": "Hibrit",
        "CarEngineCapacity": 1969,
        "CarHorsePower": 197,
        "CarType": "Sedan",
        "CarTopSpeed": 220,
        "CarAcceleration": 7.5,
        "CarTransmission": "Otomatik",
        "CarEconomy": 4.8,
        "CarWeight": 1710,
        "CarHeight": 1437,
        "CarWidth": 1879,
        "CarDriveTrain": "Önden Çekiş",
        "CarBaggageLT": 442,
        "CarBrakeMetre": 36,
        "CarPrice": 2950000,
        "CarPhotos": "https://images.unsplash.com/photo-1617531653520-bd466ee81145?w=800",
        "averageRating": 0.0,
        "reviewCount": 0,
        "createdAt": "2024-01-01T00:00:00"
    }
]


async def seed_data():
    """Seed database with sample cars"""
    
    # Check if cars already exist
    existing_count = await db.cars.count_documents({})
    
    if existing_count > 0:
        print(f"Database already has {existing_count} cars. Skipping seed.")
        return
    
    # Insert sample cars
    result = await db.cars.insert_many(sample_cars)
    print(f"Successfully inserted {len(result.inserted_ids)} cars!")
    
    # Create an admin user
    from auth import get_password_hash
    
    admin_user = {
        "userId": "admin-001",
        "email": "admin@aradakifark.com",
        "fullName": "Admin User",
        "hashedPassword": get_password_hash("admin123"),
        "role": "admin",
        "favorites": [],
        "favoriteComparisons": [],
        "createdAt": "2024-01-01T00:00:00"
    }
    
    existing_admin = await db.users.find_one({"email": admin_user["email"]})
    if not existing_admin:
        await db.users.insert_one(admin_user)
        print(f"Admin user created!")
        print(f"Email: admin@aradakifark.com")
        print(f"Password: admin123")
    else:
        print(f"Admin user already exists")
    
    print("\nSeed completed successfully!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_data())
