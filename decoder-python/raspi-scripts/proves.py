import datetime

datetime_obj = datetime.datetime.now()
UTCtime_obj = datetime.datetime.now(datetime.UTC)
timestamp = datetime_obj.strftime("%Y%m%d%H%M%S")
# print(timestamp)
print(datetime_obj)
# print(UTCtime_obj)

timestampFull = datetime.datetime.now(datetime.UTC).timestamp()
prefix = f"\\c:{timestampFull}*A\\"
# print(prefix)
