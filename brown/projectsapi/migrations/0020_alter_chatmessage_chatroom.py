# Generated by Django 3.2.9 on 2022-03-12 02:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projectsapi', '0019_alter_chatmessage_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmessage',
            name='chatRoom',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='projectsapi.project'),
        ),
    ]
