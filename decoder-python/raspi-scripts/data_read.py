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






