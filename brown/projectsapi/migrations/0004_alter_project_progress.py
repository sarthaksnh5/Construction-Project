# Generated by Django 3.2.9 on 2022-03-08 04:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projectsapi', '0003_auto_20220308_0414'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='progress',
            field=models.CharField(blank=True, default=0, max_length=4),
        ),
    ]
