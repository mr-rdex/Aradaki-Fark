from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from models import (
    Car, CarCreate, CarUpdate,
    User, UserCreate, UserLogin, UserInDB,
    Review, ReviewCreate,
    ComparisonRequest, FavoriteComparison
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
cars_collection = db.cars
users_collection = db.users
reviews_collection = db.reviews

# Create the main app
app = FastAPI(title="Aradaki Fark API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============= AUTHENTICATION ROUTES =============
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = UserInDB(
        email=user_data.email,
        fullName=user_data.fullName,
        hashedPassword=hashed_password,
        role="user"
    )
    
    user_dict = user.model_dump()
    user_dict['createdAt'] = user_dict['createdAt'].isoformat()
    
    await users_collection.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(
        data={"sub": user.userId, "email": user.email, "role": user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "userId": user.userId,
            "email": user.email,
            "fullName": user.fullName,
            "role": user.role
        }
    }


@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    """Login user"""
    user_data = await users_collection.find_one({"email": credentials.email}, {"_id": 0})
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user_data['hashedPassword']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create token
    access_token = create_access_token(
        data={"sub": user_data['userId'], "email": user_data['email'], "role": user_data['role']}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "userId": user_data['userId'],
            "email": user_data['email'],
            "fullName": user_data['fullName'],
            "role": user_data['role']
        }
    }


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    user_data = await users_collection.find_one(
        {"userId": current_user['sub']},
        {"_id": 0, "hashedPassword": 0}
    )
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data


# ============= CAR ROUTES =============
@api_router.post("/cars", response_model=Car)
async def create_car(car_data: CarCreate, current_user: dict = Depends(get_current_admin)):
    """Create a new car (admin only)"""
    car = Car(**car_data.model_dump())
    car_dict = car.model_dump()
    car_dict['createdAt'] = car_dict['createdAt'].isoformat()
    
    await cars_collection.insert_one(car_dict)
    return car


@api_router.get("/cars", response_model=List[Car])
async def get_cars(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    marka: Optional[str] = None,
    year: Optional[int] = None,
    fuelType: Optional[str] = None
):
    """Get all cars with optional filters"""
    query = {}
    if marka:
        query['ArabaMarka'] = {'$regex': marka, '$options': 'i'}
    if year:
        query['CarYear'] = year
    if fuelType:
        query['CarFuelType'] = fuelType
    
    cars = await cars_collection.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.get("/cars/search")
async def search_cars(q: str = Query(..., min_length=1)):
    """Search cars by brand or model"""
    query = {
        "$or": [
            {"ArabaMarka": {"$regex": q, "$options": "i"}},
            {"CarModel": {"$regex": q, "$options": "i"}}
        ]
    }
    
    cars = await cars_collection.find(query, {"_id": 0}).limit(20).to_list(20)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.get("/cars/popular", response_model=List[Car])
async def get_popular_cars(limit: int = Query(8, ge=1, le=20)):
    """Get popular cars (sorted by review count and rating)"""
    cars = await cars_collection.find(
        {}, {"_id": 0}
    ).sort([("reviewCount", -1), ("averageRating", -1)]).limit(limit).to_list(limit)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.get("/cars/best-baggage", response_model=List[Car])
async def get_best_baggage(limit: int = Query(5, ge=1, le=10)):
    """Get cars with best baggage capacity"""
    cars = await cars_collection.find(
        {}, {"_id": 0}
    ).sort("CarBaggageLT", -1).limit(limit).to_list(limit)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.get("/cars/best-acceleration", response_model=List[Car])
async def get_best_acceleration(limit: int = Query(5, ge=1, le=10)):
    """Get cars with best acceleration (lowest 0-100 time)"""
    cars = await cars_collection.find(
        {}, {"_id": 0}
    ).sort("CarAcceleration", 1).limit(limit).to_list(limit)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.get("/cars/best-economy", response_model=List[Car])
async def get_best_economy(limit: int = Query(5, ge=1, le=10)):
    """Get cars with best fuel economy (lowest consumption)"""
    cars = await cars_collection.find(
        {}, {"_id": 0}
    ).sort("CarEconomy", 1).limit(limit).to_list(limit)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.get("/cars/best-horsepower", response_model=List[Car])
async def get_best_horsepower(limit: int = Query(5, ge=1, le=10)):
    """Get cars with highest horsepower"""
    cars = await cars_collection.find(
        {}, {"_id": 0}
    ).sort("CarHorsePower", -1).limit(limit).to_list(limit)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.get("/cars/best-price", response_model=List[Car])
async def get_best_price(limit: int = Query(5, ge=1, le=10)):
    """Get cars with best price (lowest)"""
    cars = await cars_collection.find(
        {"CarPrice": {"$ne": None}}, {"_id": 0}
    ).sort("CarPrice", 1).limit(limit).to_list(limit)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.get("/cars/{car_id}", response_model=Car)
async def get_car(car_id: str):
    """Get a specific car by ID"""
    car = await cars_collection.find_one({"CarID": car_id}, {"_id": 0})
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    if isinstance(car.get('createdAt'), str):
        car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return car


@api_router.put("/cars/{car_id}", response_model=Car)
async def update_car(
    car_id: str,
    car_data: CarUpdate,
    current_user: dict = Depends(get_current_admin)
):
    """Update a car (admin only)"""
    update_data = {k: v for k, v in car_data.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await cars_collection.update_one(
        {"CarID": car_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    
    updated_car = await cars_collection.find_one({"CarID": car_id}, {"_id": 0})
    
    if isinstance(updated_car.get('createdAt'), str):
        updated_car['createdAt'] = datetime.fromisoformat(updated_car['createdAt'])
    
    return updated_car


@api_router.delete("/cars/{car_id}")
async def delete_car(car_id: str, current_user: dict = Depends(get_current_admin)):
    """Delete a car (admin only)"""
    result = await cars_collection.delete_one({"CarID": car_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Also delete reviews for this car
    await reviews_collection.delete_many({"carId": car_id})
    
    return {"message": "Car deleted successfully"}


# ============= COMPARISON ROUTES =============
@api_router.post("/compare")
async def compare_cars(comparison: ComparisonRequest):
    """Compare two cars"""
    car1 = await cars_collection.find_one({"CarID": comparison.car1Id}, {"_id": 0})
    car2 = await cars_collection.find_one({"CarID": comparison.car2Id}, {"_id": 0})
    
    if not car1 or not car2:
        raise HTTPException(status_code=404, detail="One or both cars not found")
    
    if isinstance(car1.get('createdAt'), str):
        car1['createdAt'] = datetime.fromisoformat(car1['createdAt'])
    if isinstance(car2.get('createdAt'), str):
        car2['createdAt'] = datetime.fromisoformat(car2['createdAt'])
    
    return {
        "car1": car1,
        "car2": car2
    }


# ============= FAVORITES ROUTES =============
@api_router.post("/favorites/cars/{car_id}")
async def add_favorite_car(car_id: str, current_user: dict = Depends(get_current_user)):
    """Add a car to favorites"""
    user_id = current_user['sub']
    
    # Check if car exists
    car = await cars_collection.find_one({"CarID": car_id})
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Add to favorites if not already there
    result = await users_collection.update_one(
        {"userId": user_id},
        {"$addToSet": {"favorites": car_id}}
    )
    
    return {"message": "Car added to favorites"}


@api_router.delete("/favorites/cars/{car_id}")
async def remove_favorite_car(car_id: str, current_user: dict = Depends(get_current_user)):
    """Remove a car from favorites"""
    user_id = current_user['sub']
    
    result = await users_collection.update_one(
        {"userId": user_id},
        {"$pull": {"favorites": car_id}}
    )
    
    return {"message": "Car removed from favorites"}


@api_router.get("/favorites/cars", response_model=List[Car])
async def get_favorite_cars(current_user: dict = Depends(get_current_user)):
    """Get user's favorite cars"""
    user_id = current_user['sub']
    
    user = await users_collection.find_one({"userId": user_id})
    if not user or not user.get('favorites'):
        return []
    
    cars = await cars_collection.find(
        {"CarID": {"$in": user['favorites']}},
        {"_id": 0}
    ).to_list(100)
    
    for car in cars:
        if isinstance(car.get('createdAt'), str):
            car['createdAt'] = datetime.fromisoformat(car['createdAt'])
    
    return cars


@api_router.post("/favorites/comparisons")
async def add_favorite_comparison(
    comparison: FavoriteComparison,
    current_user: dict = Depends(get_current_user)
):
    """Add a comparison to favorites"""
    user_id = current_user['sub']
    
    comparison_dict = comparison.model_dump()
    
    result = await users_collection.update_one(
        {"userId": user_id},
        {"$addToSet": {"favoriteComparisons": comparison_dict}}
    )
    
    return {"message": "Comparison added to favorites"}


@api_router.get("/favorites/comparisons")
async def get_favorite_comparisons(current_user: dict = Depends(get_current_user)):
    """Get user's favorite comparisons"""
    user_id = current_user['sub']
    
    user = await users_collection.find_one({"userId": user_id})
    if not user:
        return []
    
    return user.get('favoriteComparisons', [])


# ============= REVIEW ROUTES =============
@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, current_user: dict = Depends(get_current_user)):
    """Create a review for a car"""
    user_id = current_user['sub']
    
    # Check if car exists
    car = await cars_collection.find_one({"CarID": review_data.carId})
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Get user info
    user = await users_collection.find_one({"userId": user_id})
    
    # Check if user already reviewed this car
    existing_review = await reviews_collection.find_one(
        {"userId": user_id, "carId": review_data.carId}
    )
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this car")
    
    # Create review
    review = Review(
        userId=user_id,
        carId=review_data.carId,
        userName=user['fullName'],
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    review_dict = review.model_dump()
    review_dict['createdAt'] = review_dict['createdAt'].isoformat()
    
    await reviews_collection.insert_one(review_dict)
    
    # Update car's average rating and review count
    await update_car_rating(review_data.carId)
    
    return review


@api_router.get("/reviews/car/{car_id}", response_model=List[Review])
async def get_car_reviews(car_id: str):
    """Get all reviews for a car"""
    reviews = await reviews_collection.find(
        {"carId": car_id},
        {"_id": 0}
    ).sort("createdAt", -1).to_list(100)
    
    for review in reviews:
        if isinstance(review.get('createdAt'), str):
            review['createdAt'] = datetime.fromisoformat(review['createdAt'])
    
    return reviews


@api_router.get("/reviews/user", response_model=List[Review])
async def get_user_reviews(current_user: dict = Depends(get_current_user)):
    """Get all reviews by current user"""
    user_id = current_user['sub']
    
    reviews = await reviews_collection.find(
        {"userId": user_id},
        {"_id": 0}
    ).sort("createdAt", -1).to_list(100)
    
    for review in reviews:
        if isinstance(review.get('createdAt'), str):
            review['createdAt'] = datetime.fromisoformat(review['createdAt'])
    
    return reviews


@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a review (user can delete own reviews, admin can delete any)"""
    user_id = current_user['sub']
    is_admin = current_user.get('role') == 'admin'
    
    review = await reviews_collection.find_one({"reviewId": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Check if user owns the review or is admin
    if review['userId'] != user_id and not is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
    
    car_id = review['carId']
    
    await reviews_collection.delete_one({"reviewId": review_id})
    
    # Update car's average rating
    await update_car_rating(car_id)
    
    return {"message": "Review deleted successfully"}


async def update_car_rating(car_id: str):
    """Update car's average rating and review count"""
    reviews = await reviews_collection.find({"carId": car_id}).to_list(1000)
    
    if reviews:
        avg_rating = sum(r['rating'] for r in reviews) / len(reviews)
        review_count = len(reviews)
    else:
        avg_rating = 0.0
        review_count = 0
    
    await cars_collection.update_one(
        {"CarID": car_id},
        {"$set": {"averageRating": round(avg_rating, 1), "reviewCount": review_count}}
    )


# ============= ADMIN ROUTES =============
@api_router.get("/admin/users")
async def get_all_users(current_user: dict = Depends(get_current_admin)):
    """Get all users (admin only)"""
    users = await users_collection.find(
        {},
        {"_id": 0, "hashedPassword": 0}
    ).to_list(1000)
    
    return users


@api_router.put("/admin/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str = Query(...),
    current_user: dict = Depends(get_current_admin)
):
    """Update user role (admin only)"""
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await users_collection.update_one(
        {"userId": user_id},
        {"$set": {"role": role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User role updated successfully"}


@api_router.get("/admin/stats")
async def get_stats(current_user: dict = Depends(get_current_admin)):
    """Get platform statistics (admin only)"""
    total_cars = await cars_collection.count_documents({})
    total_users = await users_collection.count_documents({})
    total_reviews = await reviews_collection.count_documents({})
    
    return {
        "totalCars": total_cars,
        "totalUsers": total_users,
        "totalReviews": total_reviews
    }


# ============= ROOT ROUTE =============
@api_router.get("/")
async def root():
    return {"message": "Aradaki Fark API - Araç Karşılaştırma Platformu"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
