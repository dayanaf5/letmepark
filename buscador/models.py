from django.db import models
from djongo.models import DecimalField, FloatField


class Parkings(models.Model):
    _id = models.CharField(max_length=100, primary_key=True)
    lmpPID = models.CharField(max_length=60)
    name = models.CharField(max_length=60)
    provider = models.CharField(max_length=60)
    address =  models.CharField(max_length=500,null=True)
    lon = FloatField()
    lat = FloatField()
    
    
    class Meta:
        managed = False
        db_table = 'parkings'


class Bookingslite(models.Model):
    _id = models.CharField(max_length=100, primary_key=True)
    timestamp = models.CharField(max_length=60)
    when = models.CharField(max_length=60)
    short_code = models.CharField(max_length=60)
    lon = FloatField()
    lat = FloatField()
    position =  models.CharField(max_length=500,null=True)
    parking_found =  models.BooleanField(max_length=500,null=True)
    selected_name =  models.CharField(max_length=500,null=True)
    trello_url =  models.CharField(max_length=500,null=True)
    
    class Meta:
        managed = False
        db_table = 'bookingslite'