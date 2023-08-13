import mysql.connector

# MySQLに接続
db_connection = mysql.connector.connect(
    host='localhost',
    user='your_name',
    password='your_password',
    database='your_database'
)

# 競馬場挿入のクエリ
insert_location_query = '''
INSERT INTO RaceLocation (RaceLocationName)
VALUES (%s)
'''
# 馬券挿入のクエリ
insert_bet_type_query = '''
INSERT INTO BetType (BetTypeName)
VALUES (%s)
'''
# クラス挿入のクエリ
insert_condition_query = '''
INSERT INTO RaceCondition (RaceConditionName)
VALUES (%s)
'''

# 競馬場データ
race_locations = [
    '東京競馬場',
    '阪神競馬場',
    '中山競馬場',
    '京都競馬場',
    '中京競馬場',
    '新潟競馬場',
    '小倉競馬場',
    '札幌競馬場',
    '函館競馬場',
    '福島競馬場'
]
# 馬券の種類データ
bet_types = [
    '単勝',
    '複勝',
    'ワイド',
    '枠連',
    '馬連',
    '馬単',
    '三連複',
    '三連単',
    'Win5'
]
# クラスのデータ
race_conditions = [
    'オープン',
    '新馬戦',
    '未勝利戦',
    '1勝クラス',
    '2勝クラス',
    '3勝クラス'
]
# データベースにテーブルを作成
cursor = db_connection.cursor()

# データベースに競馬場データを挿入
for location in race_locations:
    cursor.execute(insert_location_query, (location,))
# データベースに馬券の種類データを挿入
for bet_type in bet_types:
    cursor.execute(insert_bet_type_query, (bet_type,))
# データベースにクラスの種類データを挿入
for condition in race_conditions:
    cursor.execute(insert_condition_query, (condition,))
# データベースの変更を保存
db_connection.commit()

# 接続をクローズ
cursor.close()
db_connection.close()
