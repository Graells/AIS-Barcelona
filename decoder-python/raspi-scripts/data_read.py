#!/usr/bin/env python
import time
import serial
import datetime
import os

ser = serial.Serial(
    port='/dev/ttyUSB0',
    baudrate = 38400,
    #parity=serial.PARITY_NONE,
    #stopbits=serial.STOPBITS_ONE,
    #bytesize=serial.EIGHTBITS,
    timeout=1
    )


counter=0
while 1:
    x=ser.readline()
    x.rstrip(os.linesep)
    datetime_obj = datetime.datetime.now()
    dia = str('{:02d}'.format(datetime_obj.day))
    mes = str('{:02d}'.format(datetime_obj.month))
    year = str('{:02d}'.format(datetime_obj.year))
    minut = str('{:02d}'.format(datetime_obj.minute))
    hour = str('{:02d}'.format(datetime_obj.hour))
    segon = str('{:02d}'.format(datetime_obj.second))
    fname = '/home/pi/Desktop/data_AIS/'+  year + mes + dia  +  hour + 'AIS.txt'
    f=open(fname,"a+")
    # print fname
    cadena = x[:-2] + minut + segon + '\n'
    print cadena
    f.write(cadena)
    f.close()

    #### tests below ####

    base_path = '/home/pi/Desktop/test_AIS/'
    if not os.path.exists(base_path):
        os.makedirs(base_path)
    timestamp = datetime.datetime.now() # datetime.datetime.now(datetime.UTC).timestamp()
    formatted_timestamp = timestamp.strftime('%Y%m%d%H%M%S')
    prefix = '\\c:' + formatted_timestamp + '*A\\'
    f15_name = base_path + 'AIS_15m.txt'
    f15=open(f15_name, "a+")
    f15.write(prefix + x[:-2] + '\n')
    f15.close()
    ftest_name = base_path + timestamp.strftime('%Y%m%d') + '_24_AIS.txt'
    ft=open(ftest_name, "a+")
    ft.write(prefix + x[:-2] + '\n')
    ft.close()





