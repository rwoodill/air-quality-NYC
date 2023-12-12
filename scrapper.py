from bs4 import BeautifulSoup
import requests

URL = "https://www.airnow.gov/?city=New%20York&state=NY&country=USA"
page = requests.get(URL)
#print(page.text)
soup = BeautifulSoup(page.text, 'html.parser')
liveaqi = soup.find('div',class_ = 'current-aq-data')
items = liveaqi.find_all('b')
for i in liveaqi:
    print(i)