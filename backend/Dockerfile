FROM python:3.11-slim

# ตั้ง working directory
WORKDIR /app

# Copy ไฟล์ requirements.txt เข้าไปใน container
COPY requirements.txt .

# ติดตั้ง dependencies จาก requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code ของโปรเจกต์เข้าไปใน container
COPY ./app ./app

# เปิด port 8000
EXPOSE 8000

ENTRYPOINT ["uvicorn"]
CMD ["app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
