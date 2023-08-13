import mysql.connector

# MySQL接続情報を設定
config = {
    "user": "root",      # データベースのユーザー名
    "password": "@habanero35",  # データベースのパスワード
    "host": "localhost",          # データベースのホスト名
    "database": "keiba"   # データベース名
}

# MySQLサーバーに接続
connection = mysql.connector.connect(**config)
cursor = connection.cursor()

# テーブルを作成するSQL文
create_users_table_sql = """
CREATE TABLE users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL
);
"""

create_race_location_table_sql = """
CREATE TABLE RaceLocation (
    RaceLocationID INT PRIMARY KEY AUTO_INCREMENT,
    RaceLocationName VARCHAR(255) NOT NULL
);
"""

create_race_condition_table_sql = """
CREATE TABLE RaceCondition (
    RaceConditionID INT PRIMARY KEY AUTO_INCREMENT,
    RaceConditionName VARCHAR(255) NOT NULL
);
"""

create_bet_type_table_sql = """
CREATE TABLE BetType (
    BetTypeID INT PRIMARY KEY AUTO_INCREMENT,
    BetTypeName VARCHAR(255) NOT NULL
);
"""

create_betting_record_table_sql = """
CREATE TABLE BettingRecord (
    BettingID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    RaceDate DATE,
    RaceLocationID INT,
    RaceConditionID INT,
    BetTypeID INT,
    InvestmentAmount INT,
    PayoutAmount INT,
    ExpenseAmount INT,
    FOREIGN KEY (UserID) REFERENCES users(UserID),
    FOREIGN KEY (RaceLocationID) REFERENCES RaceLocation(RaceLocationID),
    FOREIGN KEY (RaceConditionID) REFERENCES RaceCondition(RaceConditionID),
    FOREIGN KEY (BetTypeID) REFERENCES BetType(BetTypeID)
);
"""

# テーブルを作成
cursor.execute(create_users_table_sql)
cursor.execute(create_race_location_table_sql)
cursor.execute(create_race_condition_table_sql)
cursor.execute(create_bet_type_table_sql)
cursor.execute(create_betting_record_table_sql)

# 変更をコミット
connection.commit()
print("保存しました")

# 接続を閉じる
cursor.close()
connection.close()