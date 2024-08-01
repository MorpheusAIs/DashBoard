from pydantic import BaseModel
from typing import List, Dict


class Card(BaseModel):
    _id: int
    name: str
    icon: str
    amount: str
    label: str
    href: str


class ModelInfo(BaseModel):
    _id: int
    model: str
    numberOfProviders: int
    bestAsk: str
    activeSessions: int
    link: str


class ModelDataResponse(BaseModel):
    recentmodeldata: List[ModelInfo]


class ProviderExistenceResponse(BaseModel):
    providerExists: bool
