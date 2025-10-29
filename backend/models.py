from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime
import uuid


# ============= CAR MODELS =============
class Car(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    CarID: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ArabaMarka: str
    CarModel: str
    CarPack: str
    CarYear: int
    CarFuelType: str
    CarEngineCapacity: int
    CarHorsePower: int
    CarType: str
    CarTopSpeed: int
    CarAcceleration: float
    CarTransmission: str
    CarEconomy: float
    CarWeight: int
    CarHeight: int
    CarWidth: int
    CarDriveTrain: str
    CarBaggageLT: int
    CarBrakeMetre: Optional[int] = None
    CarPrice: Optional[int] = None
    CarPhotos: str
    averageRating: float = 0.0
    reviewCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class CarCreate(BaseModel):
    ArabaMarka: str
    CarModel: str
    CarPack: str
    CarYear: int
    CarFuelType: str
    CarEngineCapacity: int
    CarHorsePower: int
    CarType: str
    CarTopSpeed: int
    CarAcceleration: float
    CarTransmission: str
    CarEconomy: float
    CarWeight: int
    CarHeight: int
    CarWidth: int
    CarDriveTrain: str
    CarBaggageLT: int
    CarBrakeMetre: Optional[int] = None
    CarPrice: Optional[int] = None
    CarPhotos: str


class CarUpdate(BaseModel):
    ArabaMarka: Optional[str] = None
    CarModel: Optional[str] = None
    CarPack: Optional[str] = None
    CarYear: Optional[int] = None
    CarFuelType: Optional[str] = None
    CarEngineCapacity: Optional[int] = None
    CarHorsePower: Optional[int] = None
    CarType: Optional[str] = None
    CarTopSpeed: Optional[int] = None
    CarAcceleration: Optional[float] = None
    CarTransmission: Optional[str] = None
    CarEconomy: Optional[float] = None
    CarWeight: Optional[int] = None
    CarHeight: Optional[int] = None
    CarWidth: Optional[int] = None
    CarDriveTrain: Optional[str] = None
    CarBaggageLT: Optional[int] = None
    CarBrakeMetre: Optional[int] = None
    CarPrice: Optional[int] = None
    CarPhotos: Optional[str] = None


# ============= USER MODELS =============
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    userId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    fullName: str
    role: str = "user"  # user or admin
    favorites: List[str] = []
    favoriteComparisons: List[dict] = []
    bio: Optional[str] = None
    location: Optional[str] = None
    profilePhoto: Optional[str] = None
    kvkkAccepted: bool = False
    emailNotifications: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    fullName: str
    kvkkAccepted: bool = True
    emailNotifications: bool = True


class UserUpdate(BaseModel):
    fullName: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    profilePhoto: Optional[str] = None
    emailNotifications: Optional[bool] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserInDB(User):
    hashedPassword: str


# ============= REVIEW MODELS =============
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    reviewId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    carId: str
    userName: str
    rating: int = Field(..., ge=1, le=5)
    comment: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class ReviewCreate(BaseModel):
    carId: str
    rating: int = Field(..., ge=1, le=5)
    comment: str


# ============= OTHER MODELS =============
class ComparisonRequest(BaseModel):
    car1Id: str
    car2Id: str


class FavoriteComparison(BaseModel):
    car1Id: str
    car2Id: str
    car1Name: str
    car2Name: str
