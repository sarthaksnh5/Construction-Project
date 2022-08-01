# Generated by Django 3.2.9 on 2022-03-08 03:21

from django.db import migrations, models
import userapi.models


class Migration(migrations.Migration):

    dependencies = [
        ('userapi', '0004_auto_20220307_0757'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adminprofile',
            name='image',
            field=models.ImageField(default='', upload_to=userapi.models.adminPath),
        ),
        migrations.AlterField(
            model_name='adminprofile',
            name='mobile',
            field=models.CharField(default='0', max_length=10),
        ),
        migrations.AlterField(
            model_name='contractorprofile',
            name='image',
            field=models.ImageField(default='', upload_to=userapi.models.contractorPath),
        ),
        migrations.AlterField(
            model_name='contractorprofile',
            name='mobile',
            field=models.CharField(default='0', max_length=10),
        ),
        migrations.AlterField(
            model_name='customerprofile',
            name='address',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='customerprofile',
            name='fatherName',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='customerprofile',
            name='idNum',
            field=models.CharField(default='', max_length=20),
        ),
        migrations.AlterField(
            model_name='customerprofile',
            name='idProof',
            field=models.FileField(default='', upload_to=userapi.models.customerPath),
        ),
        migrations.AlterField(
            model_name='customerprofile',
            name='image',
            field=models.ImageField(default='', upload_to=userapi.models.customerPath),
        ),
        migrations.AlterField(
            model_name='customerprofile',
            name='mobile',
            field=models.CharField(default='0', max_length=10),
        ),
        migrations.AlterField(
            model_name='inventoryprofile',
            name='image',
            field=models.ImageField(default='', upload_to=userapi.models.inventoryPath),
        ),
        migrations.AlterField(
            model_name='inventoryprofile',
            name='mobile',
            field=models.CharField(default='0', max_length=10),
        ),
        migrations.AlterField(
            model_name='projectmanagerprofile',
            name='address',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='projectmanagerprofile',
            name='image',
            field=models.ImageField(default='', upload_to=userapi.models.projectPath),
        ),
        migrations.AlterField(
            model_name='projectmanagerprofile',
            name='mobile',
            field=models.CharField(default='0', max_length=10),
        ),
        migrations.AlterField(
            model_name='siteengineerprofile',
            name='image',
            field=models.ImageField(default='', upload_to=userapi.models.sitePath),
        ),
        migrations.AlterField(
            model_name='siteengineerprofile',
            name='mobile',
            field=models.CharField(default='0', max_length=10),
        ),
    ]