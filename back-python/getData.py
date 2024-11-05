import requests
import re
import json
import requests
import xmltodict
import json
from bs4 import BeautifulSoup
import ast
def get_houses(location,page = 1):
    headers = {
        'User-Agent': 'MyApp/1.0',  # Example User-Agent header
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',  # Example Authorization header
        'Content-Type': 'application/json'  # Example Content-Type header
    }
    try:
        url = 'https://www.zillow.com/'+str(location)+'/'+str(page)+'_p'
        # Make a GET request to the webpage
        response = requests.get(url,headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx, 5xx)
        # xml_dict = xmltodict.parse(response.text)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching content from the webpage: {e}")
        return []
    # Optionally, convert the Python dictionary to a JSON string
    soup = BeautifulSoup(response.text,'html.parser')
    data = {}
    lists=[]
    # Extract lines containing ".jpg" using regular expressions
    # jpg_lines = re.findall(r'.*\.jpg.*', response.text, re.IGNORECASE)
    totalpage = 1
    totalpageli = soup.find("li", class_=lambda x: x and 'PaginationReadoutItem' in x)
    if(totalpageli!=None):
        totalpagetext = totalpageli.find('span').get_text()
        match = re.search(r'Page \d+ of (\d+)', totalpagetext)
        if match:
            totalpage = int(match.group(1))
    divs = soup.find_all("article",role="presentation")
    for div in divs:
        detaillink = div.find('div', class_=lambda x: x and 'StyledPropertyCardDataWrapper' in x).find('a').get('href')
        address = div.find('address').get_text()
        subdev =  div.find('picture')
        # subdev =  div.find('div', class_=lambda x: x and 'StyledPropertyCardPhoto' in x)
        # print(subdev)
        if subdev == None:
            print(address)
            imgurl = ""
        else:
            imgurl = subdev.find('source').get('srcset')
        # imgurl =  div.find('div', class_=lambda x: x and 'StyledPhotoCarousel' in x)
        price = div.find('div', class_=lambda x: x and 'StyledPrice' in x).get_text()
        subdev = div.find('ul', class_=lambda x: x and 'HomeDetails' in x).find_all('li')
        details=''
        for li in subdev:
            details = details + li.get_text() + ' '
        #StyledPropertyCardHomeDetailsList
        # div_dict = ast.literal_eval(div.get_text())#.replace('@','')
        div_dict={'img':imgurl,'address':address,'price':price,'details':details,'link':detaillink}
        #if(div_dict['@type']!='Event'):
        lists.append(div_dict)     
    data['items'] = lists
    data['pages'] = totalpage      
    ## PaginationReadoutItem-c11n-8-102-0__sc-1dud86-0 hNIWEi
    
    return data



# print(get_houses('waterloo-on'))
