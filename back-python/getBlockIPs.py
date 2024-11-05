import os
IP_FILE = 'blocklist.txt'

def read_ip_list():
    if not os.path.exists(IP_FILE):
        return []
    with open(IP_FILE, 'r') as file:
        return [line.strip() for line in file.readlines()]
    
def write_ip_list(ip_list):
    with open(IP_FILE, 'w') as file:
        for ip in ip_list:
            file.write(ip + '\n')



