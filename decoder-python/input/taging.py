prefix = "\\c:1707859704.033334*A\\"

with open('freshAIS.txt', 'r') as original, open('tags.txt', 'w') as modified:
    for line in original:
        modified.write(prefix + line)
