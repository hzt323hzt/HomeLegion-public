from collections import deque
import pickle

class recentHouse:
    def __init__(self) -> None:
        self.recentList = deque([])
        self.filename = 'recents.pkl'
        self.initialized = False
    def addToRecents(self,data):
        if len(self.recentList)>2:
            self.recentList.popleft()
        self.recentList.append(data)
        return data

    def getRecents(self):
        if self.initialized:
            return list(self.recentList)
        with open(self.filename, 'rb') as file:
            self.initialized = True
            self.recentList = pickle.load(file)
        return list(self.recentList)

    def saveRecents(self):
        with open(self.filename, 'wb') as file:
        # Write new content to the file
            pickle.dump(self.recentList, file)