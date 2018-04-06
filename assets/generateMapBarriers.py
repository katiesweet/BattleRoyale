import json

print("OBSTACLE GENERATION")
print("Enter -1 at any time to break out of the current loop")
print("When asked to enter coordinates, enter in the form:")
print("\ttl.x, tl.y, br.x, br.y")

while (True):
    tileNum = raw_input("\nEnter the tile number: ")
    if tileNum == "-1":
        break

    thisDict = {}

    print "\nCOMPLETE BARRIERS (buildings):"
    completeBarriers = []
    userInput = raw_input("Enter the coordinate of the complete barrier: ")
    while(userInput != "-1"):
        tl_x, tl_y, br_x, br_y = userInput.split(',', 3)
        completeBarriers.append({"tl_x" : int(tl_x), "tl_y" : int(tl_y), "br_x" : int(br_x), "br_y" : int(br_y)})
        userInput = raw_input("Enter the coordinate of the complete barrier: ")
    thisDict["complete_barriers"] = completeBarriers

    print "\nSHOOTING BARRIERS (cactus, horses, etc.):"
    shootingBarriers = []
    userInput = raw_input("Enter the coordinate of the shooting barrier: ")
    while(userInput != "-1"):
        tl_x, tl_y, br_x, br_y = userInput.split(',', 3)
        shootingBarriers.append({"tl_x" : int(tl_x), "tl_y" : int(tl_y), "br_x" : int(br_x), "br_y" : int(br_y)})
        userInput = raw_input("Enter the coordinate of the shooting barrier: ")
    thisDict["shooting_barriers"] = shootingBarriers

    print "\nWALKING BARRIERS (fence, gravestone, etc.)"
    walkingBarriers = []
    userInput = raw_input("Enter the coordinate of the walking barrier: ")
    while(userInput != "-1"):
        tl_x, tl_y, br_x, br_y = userInput.split(',', 3)
        walkingBarriers.append({"tl_x" : int(tl_x), "tl_y" : int(tl_y), "br_x" : int(br_x), "br_y" : int(br_y)})
        userInput = raw_input("Enter the coordinate of the walking barrier: ")
    thisDict["walking_barriers"] = walkingBarriers

    print "\n\"map_" + tileNum + "\" :",
    print json.dumps(thisDict, indent=4, sort_keys=True)
