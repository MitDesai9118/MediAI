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
# CHECK CURRENT COLUMNS
# ============================================================

cursor.execute(
    "PRAGMA table_info(symptom_checks)"
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
# ADD AGE
# ============================================================

if "age" not in existing_columns:

    print("Adding age...")

    cursor.execute(
        """
        ALTER TABLE symptom_checks
        ADD COLUMN age INTEGER
        """
    )


# ============================================================
# ADD GENDER
# ============================================================

if "gender" not in existing_columns:

    print("Adding gender...")

    cursor.execute(
        """
        ALTER TABLE symptom_checks
        ADD COLUMN gender VARCHAR(30)
        """
    )


# ============================================================
# ADD DURATION
# ============================================================

if "duration" not in existing_columns:

    print("Adding duration...")

    cursor.execute(
        """
        ALTER TABLE symptom_checks
        ADD COLUMN duration VARCHAR(100)
        """
    )


# ============================================================
# ADD SEVERITY
# ============================================================

if "severity" not in existing_columns:

    print("Adding severity...")

    cursor.execute(
        """
        ALTER TABLE symptom_checks
        ADD COLUMN severity VARCHAR(30)
        """
    )


# ============================================================
# ADD ANALYSIS
# ============================================================

if "analysis" not in existing_columns:

    print("Adding analysis...")

    cursor.execute(
        """
        ALTER TABLE symptom_checks
        ADD COLUMN analysis TEXT
        """
    )


# ============================================================
# CREATED_AT ALREADY EXISTS
# ============================================================

if "created_at" in existing_columns:

    print("created_at already exists.")


# ============================================================
# SAVE
# ============================================================

connection.commit()

connection.close()


print()
print("==========================================")
print("Symptom database migration completed!")
print("==========================================")