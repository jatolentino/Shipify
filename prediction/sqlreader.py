import mysql.connector

cnx = mysql.connector.connect(user='user1', database='recom', port='3306', host='localhost', password='Recom12345)')
cursor = cnx.cursor()

query = ("SELECT * from ranking")

cursor.execute(query)

uIDs = []
iIDs = []
ratings = []
for (uID, iID, rating) in cursor:
    uIDs.append(uID)
    iIDs.append(iID)
    ratings.append(rating)

print(uIDs)
cursor.close()
cnx.close()
