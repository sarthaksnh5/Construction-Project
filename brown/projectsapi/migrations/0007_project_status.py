# Generated by Django 3.2.9 on 2022-03-08 04:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projectsapi', '0006_alter_project_customer'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='status',
            field=models.CharField(blank=True, default=0, max_length=1),
        ),
    ]
