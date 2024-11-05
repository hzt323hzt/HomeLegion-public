import sqlite3

### temporarily not use
def connectdb():
    conn = sqlite3.connect('houses.db')

    cursor = conn.cursor()
    return conn,cursor

def initdb():
    conn,cursor = connectdb()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS recentLocation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        img TEXT,
        address TEXT,
        price TEXT,
        details TEXT,
        link TEXT,
        status INTEGER
    )
    ''')

    # Commit the changes
    conn.commit()

def insertHouses(data):
    """[('img',  'address','price','details','link',1)]""" 

    conn,cursor = connectdb()
    cursor.executemany('''
    INSERT INTO table_name (img, address, price, details, link, status)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(address) 
    DO UPDATE SET status = 1;
    ''', data)
    conn.commit()

def updateJobs(data):
    """[(<status> 1, <id> 228437)]"""

    conn,cursor = connectdb()
    for line in data:
        cursor.execute('''
        UPDATE jobs
        SET status = ?
        WHERE id = ?
        ''', line)
    # Commit the changes
    conn.commit()

def getJobStatus(jobid):
    """return 1 0 -1"""
    conn,cursor = connectdb()
    cursor.execute('SELECT status FROM jobs where id = ?',[(jobid)])
    rows = cursor.fetchall()
    if(len(rows)<1):
        return -1
    return rows[0][0]

def main():
    initdb()

if __name__ == "__main__":
    main()