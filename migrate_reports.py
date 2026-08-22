import os
import sqlite3


# ============================================================
# DATABASE PATH
# ============================================================

BASE_DIR = os.path.abspath(
    os.path.dirname(__file__)
)

DATABASE_PATH = os.path.join(
    BASE_DIR,
    "database",
    "medical.db"
)


print("Database:")
print(DATABASE_PATH)


# ============================================================
# CONNECT
# ============================================================

connection = sqlite3.connect(
    DATABASE_PATH
)

cursor = connection.cursor()


# ============================================================
# CHECK EXISTING COLUMNS
# ============================================================

cursor.execute(
    "PRAGMA table_info(medical_reports)"
)

columns = cursor.fetchall()

existing_columns = {
    column[1]
    for column in columns
}


print()
print("Existing columns:")
print(existing_columns)
print()


# ============================================================
# ADD FILE TYPE
# ============================================================

if "file_type" not in existing_columns:

    print("Adding file_type...")

    cursor.execute(
        """
        ALTER TABLE medical_reports
        ADD COLUMN file_type VARCHAR(50)
        """
    )


# ============================================================
# ADD EXTRACTED TEXT
# ============================================================

if "extracted_text" not in existing_columns:

    print("Adding extracted_text...")

    cursor.execute(
        """
        ALTER TABLE medical_reports
        ADD COLUMN extracted_text TEXT
        """
    )


# ============================================================
# SAVE
# ============================================================

connection.commit()

connection.close()


print()
print("==========================================")
print("Medical report migration completed!")
print("==========================================")