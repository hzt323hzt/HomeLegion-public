import requests
import re
import json
import requests
import xmltodict
import json
import urllib.parse
from bs4 import BeautifulSoup
import ast
from fuzzywuzzy import process
import requests

googleApiKey = 'YOUR GOOGLE MAP API KEY'

def getSingleHouse(location:str):

    candidate_addresses = geocode_address(location)
    # print(candidate_addresses)
    pure_address = filter_addresses(candidate_addresses)
    # print(pure_address)
    closest_address = find_closest_address(location, pure_address)

    if closest_address=="":
        return {}
    # print(f"候选地址: {candidate_addresses}")
    # print(f"最接近的地址: {closest_address}")
    return makeURL(closest_address)

def filter_addresses(candidate_addresses):
    filtered_addresses = []
    for address in candidate_addresses:
        # 检查地址是否包含 'USA' 或 'CA'
        if 'USA' in address or 'CA' in address:
            filtered_addresses.append(address)
    return filtered_addresses



def zillow_style_city(location:str):
    candidate_addresses = geocode_address(location)
    closest_address = find_closest_address(location, candidate_addresses)
    
    # Extract city and state from the closest address
    address_parts = closest_address.split(',')
    # print(address_parts)
    address_parts = address_parts[:-1]
    if len(address_parts) >= 2:
        city = address_parts[0].strip().lower().replace(' ', '-')
        state = address_parts[1].strip().lower().replace(' ', '-')
    newCitystr = f"{city}-{state}"
    return newCitystr

def geocode_address(address):
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": address,
        "key": googleApiKey,
        #"components": 'country:US|country:CA'
    }
    response = requests.get(base_url, params=params)
    # print(f"请求 URL: {response.url}")  # 打印请求的 URL
    if response.status_code == 200:
        results = response.json().get("results", [])
        if results:
            return [result["formatted_address"] for result in results]
        else:
            print("No results found in API response.")  # 打印调试信息
            print(response.text)
            return []
    else:
        print(f"API 请求失败，状态码: {response.status_code}")
        return []


def find_closest_address(partial_address, candidate_addresses):
    if not candidate_addresses:
        return ""
    if isinstance(partial_address, list):
        partial_address = partial_address[0]
    closest_address, score = process.extractOne(partial_address, candidate_addresses)
    return closest_address

def genterate_zillow_url(address):
    words = address.split()
    # Remove the last word
    words = words[:-1]
    # Join the remaining words back into a sentence
    address = ' '.join(words)
    base_url = "https://www.zillow.com/homes/"
    formatted_address= address.replace(" ", "-").replace(',','')
    full_url = f"{base_url}{formatted_address}_rb/"
    # print('genterate_zillow_url: '+full_url)
    return full_url

def makeURL(location):
    # zillowAddress = genterate_zillow_url(location)
    headers = {
        'User-Agent': 'MyApp/1.0',  # Example User-Agent header
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',  # Example Authorization header
        'Content-Type': 'application/json'  # Example Content-Type header/
    }
    url=""
    try:
        url = genterate_zillow_url(location)
        # print('url = ' + url)
        # Make a GET request to the webpage
        response = requests.get(url,headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx, 5xx)
 
    except requests.exceptions.RequestException as e:
        print(f"Error fetching content from the webpage: {e}")
        return []
    # Optionally, convert the Python dictionary to a JSON string
    soup = BeautifulSoup(response.text,'html.parser')
    img_src = soup.find('picture').find('img').get('src')
    # homeValue = soup.find("h3", class_=lambda x: x and 'StyledHeading' in x).text
    h3styled = soup.find("h3", class_=lambda x: x and 'StyledHeading' in x)
    if h3styled:
        homeValue = h3styled.text
    else:
        homeValue = soup.find("div", class_=lambda x: x and 'StyledPrice' in x).text
    dataList = soup.findAll("span", class_=lambda x: x and 'Text' in x)
    bd = ""
    ba = ""
    area1 = ""
    if len(dataList)>0:
        bd = dataList[0].text
    if len(dataList)>1:
        ba = dataList[1].text
    if len(dataList)>2:
        area1 = dataList[2].text #房屋面积
    #type = soup.find("span", class_= 'Text-c11n-8-99-3__sc-aiai24-0 dpf__sc-2arhs5-3 dFxMdJ kOlNqB')
    div_dict={'img':img_src,'price':homeValue,'address':location,'details': bd + ba + area1, 'link': url}
    # print(div_dict)
    #     #if(div_dict['@type']!='Event'):
    #     lists.append(div_dict)     
    # data['items'] = lists
    # data['pages'] = totalpage      
    # ## PaginationReadoutItem-c11n-8-102-0__sc-1dud86-0 hNIWEi
    
    return div_dict

# def main():

#     print(getSingleHouse("794 ramona ave"))

#     # Test with "Los Angeles"
#     location = "los angeles"
#     result = zillow_style_city(location)
#     print(result)
#     location = "dayton"
#     result = zillow_style_city(location)
#     print(result)
#     location = "toronto"
#     result = zillow_style_city(location)
#     print(result)
#     location = "santa clara"
#     result = zillow_style_city(location)
#     print(result)
#     location = "Salt Lake City"
#     result = zillow_style_city(location)
#     print(result)
    

# if __name__ == "__main__":
#    main()
