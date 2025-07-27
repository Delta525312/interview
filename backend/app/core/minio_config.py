import os
import json
from dotenv import load_dotenv
from minio import Minio
from minio.error import S3Error

# โหลดค่าจากไฟล์ .env
load_dotenv()

# 1. ดึงค่าจาก Environment Variables
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")

# กำหนดค่า MinIO client
minio_client = Minio(
    endpoint=MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

bucket_name = "user-profile"

# public read policy JSON
public_read_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": ["*"]},
            "Action": ["s3:GetObject"],
            "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
        }
    ]
}

# ตรวจสอบและสร้าง bucket + ตั้ง policy
try:
    found = minio_client.bucket_exists(bucket_name)
    if not found:
        minio_client.make_bucket(bucket_name)
        print(f"✅ Created bucket: {bucket_name}")

    # ตั้ง policy ให้ public read ทุกกรณี
    minio_client.set_bucket_policy(bucket_name, json.dumps(public_read_policy))
    print(f"✅ Set public read policy on: {bucket_name}")

except S3Error as e:
    print(f"❌ MinIO error: {e}")
