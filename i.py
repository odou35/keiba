import mysql.connector

# MySQL接続情報を設定
config = {
    "user": "root",      # データベースのユーザー名
    "password": "@habanero35",  # データベースのパスワード
    "host": "localhost",          # データベースのホスト名
    "database": "keiba"   # データベース名
}

# MySQLサーバーに接続します
connection = mysql.connector.connect(**config)
cursor = connection.cursor()

# データを挿入するSQLクエリを定義します
insert_query = (
    "INSERT INTO BettingRecord "
    "(UserID, RaceDate, RaceLocationID, RaceConditionID, BetTypeID, InvestmentAmount, PayoutAmount, ExpenseAmount) "
    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
)

# データを挿入するための値を準備します
user_id = 1
race_date = "2023-07-31"  # フォーマット: "YYYY-MM-DD"
race_location_id = 1
race_condition_id = 2
bet_type_id = 3
investment_amount = 1000
payout_amount = 0
expense_amount = -1000

# データを挿入します
data = (user_id, race_date, race_location_id, race_condition_id, bet_type_id, investment_amount, payout_amount, expense_amount)
cursor.execute(insert_query, data)

# 変更をコミットしてデータベースに反映させます
connection.commit()

# 接続をクローズします
cursor.close()
connection.close()
