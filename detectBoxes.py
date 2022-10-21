from cgi import print_arguments
import json


class Box:
    def __init__(self, rect) -> None:
        self.stPoint = [rect[0], rect[1]]
        self.enPoint = [rect[0] + rect[2], rect[1] + rect[3]] 
        self.cePoint = [rect[0] + rect[2]/2, rect[1] + rect[3]/2]
        self.w = rect[2]
        self.h = rect[3]

    def show(self):
        print(self.stPoint)
        print(self.enPoint)
        print(self.cePoint)
        print(self.w)
        print(self.h)
        print("============================================")

f = open("test.txt", "r")
txtData = f.read()
data = json.loads(txtData)

boxes = []



for key in data:
    for value in data[key]:
        boxes.append(Box(value[1]))


for box in boxes:
    box.show()

