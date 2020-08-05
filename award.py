import requests
import re
import pandas as pd
from bs4 import BeautifulSoup as bs
import csv
url = "https://www.fairwork.gov.au/awards-and-agreements/awards/list-of-awards"
r = requests.get(url)
r.close()
r = r.text
urls = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', r)
final = []
for url in urls:
    if 'http://awardviewer.fwo.gov.au/award/show' in url:
        final.append(url)


import os
if not os.path.exists('Data'):
    os.makedirs('Data')
#url = final[30]
for url in final:
    try:
        print(url)
        r = requests.get(url)
        soup = bs(r.text,features="lxml")
        r.close()
        tables = soup.findAll("table")
        nm = soup.find("title")
        nm = nm.text.replace(':','')
        print(nm)
        output_rows = []

        for table in tables:
            first = True

            for table_row in table.findAll('tr'):
                columns = table_row.findAll('td')
                output_row = []
                for column in columns:
                    if column.text == '\xa0':
                        break
                    output_row.append(column.text)
                if first:
                    first = False
                    if 'classification' not in output_row[0].lower():
                        break
                if output_row != []:
                    if len(output_row)<3:
                        for _ in range(3-len(output_row)):
                            output_row.append('')
                    output_rows.append(output_row)
            
        dt = pd.DataFrame(output_rows)
        dt.to_csv('Data/'+nm + '.csv',header=False,index=False)
    except Exception as e:
        print(e)





#html = requests.get(final[0]).content
#df_list = pd.read_html(html)
#df = df_list[-1]
#print(df)
#df.to_csv('my data.csv') 
