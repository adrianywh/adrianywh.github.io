import requests, json
import timeit, time, datetime
from operator import itemgetter
from git import Repo

#pyinstaller -F pull-vgcstats-data.py

startTime = timeit.timeit()

print("getting mss data")
mssdata = requests.get("https://sheets.googleapis.com/v4/spreadsheets/1HtP66BykSfSlBCV5bQwehcc2n4LfCicTyZOC0im2vpc/values/Input-MSS?dateTimeRenderOption=FORMATTED_STRING&valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyC3FsbFxets0WTIJXOYC88vqQb-Bc6mZKg")
print("getting pc data")
pcdata = requests.get("https://sheets.googleapis.com/v4/spreadsheets/1HtP66BykSfSlBCV5bQwehcc2n4LfCicTyZOC0im2vpc/values/Input-PC?dateTimeRenderOption=FORMATTED_STRING&valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyC3FsbFxets0WTIJXOYC88vqQb-Bc6mZKg")
print("getting reg data")
regdata = requests.get("https://sheets.googleapis.com/v4/spreadsheets/1HtP66BykSfSlBCV5bQwehcc2n4LfCicTyZOC0im2vpc/values/Input-REG?dateTimeRenderOption=FORMATTED_STRING&valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyC3FsbFxets0WTIJXOYC88vqQb-Bc6mZKg")
print("getting nat data")
natdata = requests.get("https://sheets.googleapis.com/v4/spreadsheets/1HtP66BykSfSlBCV5bQwehcc2n4LfCicTyZOC0im2vpc/values/Input-INT?dateTimeRenderOption=FORMATTED_STRING&valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyC3FsbFxets0WTIJXOYC88vqQb-Bc6mZKg")

data = [mssdata, pcdata, regdata, natdata]
type = ['MSS','PC','REG','NAT']

count = 0
jsonOutputData = []
count2 = 1
uniquePokmnId = []

for eventType in data:
    isFirst = True
    headerList = []
    
    jsonData = json.loads(eventType.text)
    
    for item in jsonData['values']:
        if (len(item) == 0):
            continue

        if isFirst:
            headerList.append(item.index("Date"))
            headerList.append(item.index("Region"))
            headerList.append(item.index("Country"))
            headerList.append(item.index("Placing"))
            headerList.append(item.index("Player"))
            headerList.append(item.index("Pokemon 1"))
            headerList.append(item.index("Pokemon 2"))
            headerList.append(item.index("Pokemon 3"))
            headerList.append(item.index("Pokemon 4"))
            headerList.append(item.index("Pokemon 5"))
            headerList.append(item.index("Pokemon 6"))
            headerList.append(item.index("Img1"))
            headerList.append(item.index("Img2"))
            headerList.append(item.index("Img3"))
            headerList.append(item.index("Img4"))
            headerList.append(item.index("Img5"))
            headerList.append(item.index("Img6"))
            headerList.append(item.index("Standing"))
            headerList.append(item.index("Playlist"))
            isFirst = False
        else:
            rowData = {}
            
            splittedDate = item[headerList[0]].split("/")
            if(len(splittedDate[0])==1):
                splittedDate[0] = "0"+splittedDate[0]
            if(len(splittedDate[1])==1):
                splittedDate[1] = "0"+splittedDate[1]
            
            series = "Err"
            if(int(splittedDate[2]) == 2019 and int(splittedDate[0]) >= 4 and int(splittedDate[1])>=2):
                series = "Ultra"
            elif (int(splittedDate[2]) == 2019 and int(splittedDate[0]) >= 1 and int(splittedDate[1])>=8):
                series = "Moon"
            else:
                series = "Sun"    
            
            rowData["event_date"] = str(splittedDate[2]+"/"+splittedDate[0]+"/"+splittedDate[1]).strip()
            rowData["region_text"] = str(item[headerList[1]]).strip()
            rowData["country_text"] = str(item[headerList[2]]).strip()
            rowData["placing_text"] = int(item[headerList[3]])
            rowData["player_text"] = str(item[headerList[4]]).strip()
            rowData["pkmn1_text"] = str(item[headerList[5]]).strip()
            rowData["pkmn2_text"] = str(item[headerList[6]]).strip()
            rowData["pkmn3_text"] = str(item[headerList[7]]).strip()
            rowData["pkmn4_text"] = str(item[headerList[8]]).strip()
            rowData["pkmn5_text"] = str(item[headerList[9]]).strip()
            rowData["pkmn6_text"] = str(item[headerList[10]]).strip()
            rowData["img1_text"] = str(item[headerList[11]]).strip()
            rowData["img2_text"] = str(item[headerList[12]]).strip()
            rowData["img3_text"] = str(item[headerList[13]]).strip()
            rowData["img4_text"] = str(item[headerList[14]]).strip()
            rowData["img5_text"] = str(item[headerList[15]]).strip()
            rowData["img6_text"] = str(item[headerList[16]]).strip()
            rowData["standing_text"] = int(item[headerList[17]])
            rowData["playlist_text"] = str(type[count]).strip()
            rowData["series_text"]  = str(series).strip()
            
            jsonOutputData.append(rowData)

            print("processed "+str(count2)+" items")
            count2 += 1
    count += 1

sortedData = sorted(jsonOutputData, key=itemgetter("series_text","playlist_text","region_text","country_text","placing_text"))
sortedData.sort(key=itemgetter("event_date"),reverse=True)

projectFolder= "D:/github/adrianywh.github.io"
dumpLocation = "resource/vgc19Teams.json"

# with open(projectFolder+"/"+dumpLocation, 'w') as outfile:  
#     json.dump(sortedData, outfile)

outFile = open(projectFolder+"/"+dumpLocation, 'w')
outFile.write(json.dumps(sortedData,indent=4,sort_keys=True))

endTime = timeit.timeit()

print("vgcstats json data output completed")

# exit()  # to skip git process

repo = Repo(projectFolder)

print("Performing git check...")

isVgc19DataUpdated = False
for dirtyFile in [ item.a_path for item in repo.index.diff(None) ]:
    print(dirtyFile)
    if dirtyFile == dumpLocation:
        print("Dirty "+dumpLocation+" detected will commit and push new version")
        ########## start index, commit and pust to git
        timestamp = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
        repo.index.add([dumpLocation])
        repo.index.commit("Modified teams data "+timestamp)
        
        origin = repo.remote('origin')
        origin.push()
        ########## end index, commit and pust to git
        isVgc19DataUpdated = True
    else:
        continue
if not isVgc19DataUpdated:
    print(dumpLocation+" has no changes")

print(str(datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S'))+" vgcstats data pull completed. time taken: "+ str(endTime-startTime))