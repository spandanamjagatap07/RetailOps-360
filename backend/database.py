from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:spandu@localhost:5432/retailops360"

engine = create_engine(DATABASE_URL)